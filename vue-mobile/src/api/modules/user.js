import webApi from 'src/api/web-api'
import store from 'src/store'

export default () => {
  return {
    login: async (parameters) => {
      return webApi.sendRequest({
        moduleName: 'Core',
        methodName: 'Login',
        parameters,
      }).then((result) => {
        return result
      }, () => {
        return false
      })
    },

    logout() {
      return webApi.sendRequest({
        moduleName: 'Core',
        methodName: 'Logout',
        parameters: {},
      }).then(
        () => {
          store.dispatch('user/logout')
        },
        () => {
          store.dispatch('user/logout')
        }
      )
    },

    confirmTwoFactorAuth: async (parameters) => {
      return webApi.sendRequest({
        moduleName: 'TwoFactorAuth',
        methodName: 'VerifyAuthenticatorAppCode',
        parameters,
      }).then((result) => {
        return result
      })
    },
    trustTheDevice: async (parameters) => {
      return webApi.sendRequest({
        moduleName: 'TwoFactorAuth',
        methodName: 'TrustDevice',
        parameters,
      }).then((result) => {
        return result
      })
    },
    getUsedDevices: async (parameters) => {
      return webApi.sendRequest({
        moduleName: 'TwoFactorAuth',
        methodName: 'GetUsedDevices',
        parameters,
      }).then((result) => {
        return result
      })
    },
  }
}
