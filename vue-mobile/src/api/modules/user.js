import WebApi from 'src/api/web-api'
import store from 'src/store'

export default () => {
  return {
    login: async (parameters) => {
      return WebApi.sendRequest({
        moduleName: 'Core',
        methodName: 'Login',
        parameters,
      }).then((result) => {
        if (result && result?.AuthToken) {
          return result
        }
        return ''
      })
    },
    logout() {
      return WebApi.sendRequest({
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
  }
}
