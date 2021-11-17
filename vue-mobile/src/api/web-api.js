import axios from 'axios'
import VueCookies from 'vue-cookies'
import querystring from 'querystring'

// import errors from 'src/utils/errors'
import { getApiHost } from 'src/api/helpers'
import _ from "lodash";

// import eventBus from 'src/event-bus'
// import store from 'src/store'

export default {
  sendRequest: function ({ moduleName, methodName, parameters }) {
    return new Promise((resolve, reject) => {
      const unknownError = {
        ErrorCode: 0,
        Module: moduleName,
      }

      // eventBus.$emit('webApi::Request::before', parameters)

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
        .then((response) => {
          console.log(response, 'resporesponseresponsense')
          resolve(response.data.Result)
        })
        .catch((error) => {
          const errorResponse = _.extend(unknownError, { ErrorMessage: error.message })
          // eventBus.$emit('webApi::Response', { moduleName, methodName, parameters, response: errorResponse })
          reject(errorResponse)
        })
    })
  },
}
