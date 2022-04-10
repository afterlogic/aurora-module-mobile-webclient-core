import webApi from 'src/api/web-api'
import store from 'src/store'

export default {
  getAppData: async () => {
    return webApi.sendRequest({
      moduleName: 'Core',
      methodName: 'GetAppData',
      parameters: {},
    })
      .then(result => result)
      .catch(error => false)
  },

  login: async (parameters) => {
    return webApi.sendRequest({
      moduleName: 'Core',
      methodName: 'Login',
      parameters,
    })
      .then(result => result)
      .catch(error => false)
  },

  logout() {
    return webApi.sendRequest({
      moduleName: 'Core',
      methodName: 'Logout',
      parameters: {},
    })
      .then(result => {
        store.dispatch('core/logout')
      })
      .catch(error => {
        store.dispatch('core/logout')
      })
  },
}
