import axios from 'axios'
import VueCookies from 'vue-cookies'
import querystring from 'querystring'

import errors from 'src/utils/errors'
import AppApi from 'src/api/index'
import { getApiHost } from 'src/api/helpers'
import { saveAs } from 'file-saver'
import _ from 'lodash'
import notification from 'src/utils/notification'
import store from 'src/store'
import { i18n } from 'boot/i18n'

export default {
  sendRequest: function ({
    moduleName,
    methodName,
    parameters,
    silentError = false,
    defaultText,
  }) {
    console.log(i18n, 'i18n')
    return new Promise((resolve, reject) => {
      const unknownError = {
        ErrorCode: 0,
        Module: moduleName,
      }

      //eventBus.$emit('webApi::Request::before', parameters)

      const postData = {
        Module: moduleName,
        Method: methodName,
      }
      if (!_.isEmpty(parameters)) {
        postData.Parameters = JSON.stringify(parameters)
      }

      // The AuthToken needs to be read from the cookie (not from store) to always match the cookies sent to the server.
      // If a user is also logged in the browser, then his AppData will be received and the login screen will be displayed,
      // because the user is not a superadmin.
      const authToken = VueCookies.get('AuthToken')
      const headers = {}
      if (authToken) {
        headers.Authorization = 'Bearer ' + authToken
      }

      axios({
        method: 'post',
        url: getApiHost() + '?/Api/',
        data: querystring.stringify(postData),
        headers,
      })
        .then(
          (response) => {
            const isOkResponse = response?.status === 200 && !!response?.data
            if (isOkResponse) {
              //eventBus.$emit('webApi::Response', { moduleName, methodName, parameters, response: response.data })
              const result = response.data.Result
              if (
                !result &&
                (response.data.ErrorCode ||
                  response.data.ErrorMessage ||
                  response.data.SubscriptionsResult)
              ) {
                if (
                  errors.isAuthError(response.data.ErrorCode) &&
                  methodName !== 'Logout'
                ) {
                  AppApi.user.logout()
                } else {
                  if (!silentError) {
                    notification.showError(
                      errors.getTextFromResponse(response.data, defaultText)
                    )
                  }
                  reject(response.data)
                }
              } else {
                resolve(result)
              }
            } else {
              //eventBus.$emit('webApi::Response', { moduleName, methodName, parameters, response: unknownError })
              if (!silentError) {
                notification.showError(
                  errors.getTextFromResponse(unknownError, defaultText)
                )
              }
              reject(unknownError)
            }
          },
          () => {
            //eventBus.$emit('webApi::Response', { moduleName, methodName, parameters, response: unknownError })
            if (!silentError) {
              notification.showError(
                errors.getTextFromResponse(unknownError, defaultText)
              )
            }
            reject(unknownError)
          }
        )
        .catch((error) => {
          const errorResponse = _.extend(unknownError, {
            ErrorMessage: error.message,
          })
          //eventBus.$emit('webApi::Response', { moduleName, methodName, parameters, response: errorResponse })
          if (!silentError) {
            notification.showError(
              errors.getTextFromResponse(errorResponse, defaultText)
            )
          }
          reject(errorResponse)
        })
    })
  },
  downloadByUrl: async function ({ downloadUrl, fileName, file = null }) {
    return new Promise((resolve, reject) => {
      const CancelToken = axios.CancelToken
      let url = getApiHost() + '/' + downloadUrl
      let authToken = VueCookies.get('AuthToken')
      let headers = {
        'Content-Type': 'multipart/form-data',
      }
      if (authToken) {
        headers['Authorization'] = 'Bearer ' + authToken
      }
      axios({
        method: 'get',
        url: url,
        headers: headers,
        responseType: 'blob',
        cancelToken: new CancelToken(function (c) {
          store.dispatch('files/changeItemProperty', {
            item: file,
            property: 'cancelToken',
            value: c,
          })
        }),
        onDownloadProgress: function (progressEvent) {
          if (file) {
            let percentCompleted = Math.round(
              (progressEvent.loaded * 100) / file.size
            )
            store.dispatch('files/changeItemProperty', {
              item: file,
              property: 'percentDownloading',
              value: percentCompleted,
            })
          }
        },
      })
        .then((response) => {
          saveAs(
            new Blob([response.data], { type: response.data.type }),
            fileName
          )
          store.dispatch('files/changeItemProperty', {
            item: file,
            property: 'downloading',
            value: false,
          })
          resolve(response)
        })
        .catch((response) => {
          store.dispatch('files/changeItemProperty', {
            item: file,
            property: 'percentDownloading',
            value: 0,
          })
          store.dispatch('files/changeItemProperty', {
            item: file,
            property: 'downloading',
            value: false,
          })
          reject(response)
        })
    })
  },
}
