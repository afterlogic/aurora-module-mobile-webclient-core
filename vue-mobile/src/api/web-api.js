import axios from 'axios'
import VueCookies from 'vue-cookies'
import querystring from 'querystring'
import _ from 'lodash'
import { saveAs } from 'file-saver'

import errors from 'src/utils/errors'
import coreWebApi from 'src/api/core-web-api'
import { getApiHost } from 'src/api/helpers'
import notification from 'src/utils/notification'
import store from 'src/store'

function rejectWithError(reject, responseData, defaultErrorText, silentError) {
  const errorText = errors.getTextFromResponse(responseData, defaultErrorText)
  if (!silentError) {
    notification.showError(errorText)
  }
  reject(new Error(errorText))
}

export default {
  sendRequest: function ({
    moduleName,
    methodName,
    parameters,
    silentError = false,
    defaultErrorText,
  }) {
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
      const deviceId = VueCookies.get('DeviceId')
      const headers = {
        'X-DeviceId': deviceId,
        'X-MobileApp': '1'
      }
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
              if (!result) {
                const needToLogout = errors.isAuthError(response.data.ErrorCode)
                  && methodName !== 'Logout' && methodName !== 'Login'
                if (needToLogout) {
                  coreWebApi.logout()
                } else {
                  rejectWithError(reject, response.data, defaultErrorText, silentError)
                }
              } else {
                resolve(result)
              }
            } else {
              //eventBus.$emit('webApi::Response', { moduleName, methodName, parameters, response: unknownError })
              rejectWithError(reject, unknownError, defaultErrorText, silentError)
            }
          },
          () => {
            //eventBus.$emit('webApi::Response', { moduleName, methodName, parameters, response: unknownError })
            rejectWithError(reject, unknownError, defaultErrorText, silentError)
          }
        )
        .catch((error) => {
          const errorResponse = _.extend(unknownError, {
            ErrorMessage: error.message,
          })
          //eventBus.$emit('webApi::Response', { moduleName, methodName, parameters, response: errorResponse })
          rejectWithError(reject, errorResponse, defaultErrorText, silentError)
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
          store.dispatch('filesmobile/changeItemProperty', {
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
            store.dispatch('filesmobile/changeItemProperty', {
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
          store.dispatch('filesmobile/changeItemProperty', {
            item: file,
            property: 'downloading',
            value: false,
          })
          resolve(response)
        })
        .catch((response) => {
          store.dispatch('filesmobile/changeItemProperty', {
            item: file,
            property: 'percentDownloading',
            value: 0,
          })
          store.dispatch('filesmobile/changeItemProperty', {
            item: file,
            property: 'downloading',
            value: false,
          })
          reject(response)
        })
    })
  },
}
