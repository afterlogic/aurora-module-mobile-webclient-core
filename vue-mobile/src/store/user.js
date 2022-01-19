import VueCookies from 'vue-cookies'
import AppApi from '/src/api/index'

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
      console.log('DT: resp 1', response)
      if (response?.AuthToken) {
        VueCookies.set('AuthToken', response?.AuthToken)
        //VueCookies.set('SameSite', 'None')
        commit('changeAuthTokenStatus', true)
      } else {
        commit('changeAuthTokenStatus', false)
      }
      return response
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
