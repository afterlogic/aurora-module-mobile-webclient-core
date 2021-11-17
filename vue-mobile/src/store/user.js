import typesUtils from 'src/utils/types.js'
import VueCookies from 'vue-cookies'

import AppApi from '/src/api/index'
export default {
  namespaced: true,
  state: {
    hasAuthToken: false,
  },
  mutations: {
    changeAuthTokenStatus (state, status) {
      state.hasAuthToken = status
    },
  },
  actions: {
    async login ({ commit }, parameters) {
      const response = await AppApi.User.login(parameters)
      if (response?.AuthToken) {
        VueCookies.set('AuthToken', response?.AuthToken)
        commit('changeAuthTokenStatus', true)
      } else {
        commit('changeAuthTokenStatus', false)
        console.log('login error')
      }
    },
    init({ commit }) {
      const authToken = VueCookies.get('AuthToken')
      commit('changeAuthTokenStatus', !!authToken)
    },
    logout ({ commit }) {
      commit('setAuthToken', '')
    },
  },
  getters: {
    getAuthTokenStatus(state) {
      return state.hasAuthToken
    }
  },
}
