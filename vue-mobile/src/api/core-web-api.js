import webApi from 'src/api/web-api'
// import store from 'src/stores'
import { useCoreStore } from 'src/stores/index-pinia'

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
    const coreStore = useCoreStore()

    return webApi.sendRequest({
      moduleName: 'Core',
      methodName: 'Logout',
      parameters: {},
    })
      .then(result => {
        // store.dispatch('core/logout')
        coreStore.logout()
      })
      .catch(error => {
        // store.dispatch('core/logout')
        coreStore.logout()
      })
  },
}
