import webApi from 'src/api/web-api'
import store from 'src/store'

export default {
  getAppData: async () => {
    return webApi.sendRequest({
      moduleName: 'Core',
      methodName: 'GetAppData',
      parameters: {},
    }).then((result) => {
      if (result) {
        return result
      }
      return ''
    })
  },

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
        store.dispatch('core/logout')
      },
      () => {
        store.dispatch('core/logout')
      }
    )
  },
}
