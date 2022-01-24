import VueCookies from 'vue-cookies'
import AppApi from '/src/api/index'
import core from 'src/core'

export default {
  namespaced: true,
  state: {
    hasAuthToken: false,
  },
  mutations: {
    changeAuthTokenStatus: (state, status) => (state.hasAuthToken = status),
  },
  actions: {
    loginFunc: async ({ commit }, parameters) => {
      const response = await AppApi.User.login(parameters)
      if (response?.AuthToken) {
        VueCookies.set('AuthToken', response?.AuthToken)
        await core.requestAppData()
        //VueCookies.set('SameSite', 'None')
        commit('changeAuthTokenStatus', true)
      } else {
        commit('changeAuthTokenStatus', false)
      }
      return response
    },
    confirmTwoFactorAuth: async ({ commit }, payload) => {
      const response = await AppApi.User.confirmTwoFactorAuth(payload)
      if (response?.AuthToken) {
        VueCookies.set('AuthToken', response.AuthToken)
        await core.requestAppData()
        commit('changeAuthTokenStatus', true)
      } else {
        commit('changeAuthTokenStatus', false)
      }
    },
    trustTheDevice: async ({ commit }, payload) => {
      const response = await AppApi.User.trustTheDevice(payload)
      console.log('DB: response trust', response)
    },
    init: ({ commit }) => {
      const authToken = VueCookies.get('AuthToken')
      commit('changeAuthTokenStatus', !!authToken)
    },
    logout: ({ commit }) => {
      VueCookies.set('AuthToken', '')
      commit('changeAuthTokenStatus', false)
    },
  },
  getters: {
    getAuthTokenStatus: (state) => {
      return state.hasAuthToken
    },
  },
}
