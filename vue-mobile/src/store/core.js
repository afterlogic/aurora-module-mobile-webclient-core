import typesUtils from 'src/utils/types.js'
import AppApi from '/src/api/index'

export default {
  namespaced: true,
  state: {
    appData: false,
    user: null,
  },
  mutations: {
    setAppData (state, appData) {
      state.appData = appData
    },
    setCurrentUser(state, user) {
      state.user = user
    }
  },
  actions: {
    async asyncGetAppData ({ commit }) {
      const appData = await AppApi.Core.getAppData()
      if (typesUtils.pObject(appData)) {
        commit('setAppData', appData)
      }
    },
    async init({ dispatch, commit, state }) {
      await dispatch('asyncGetAppData')

      const appData = state.appData

      if (typesUtils.pObject(appData?.User)) {
        commit('setCurrentUser', appData.User)
      }
    },
  },
  getters: {
    getAppData(state) {
      return state.appData
    },
    currentUser(state) {
      return state.user
    }
  },
}
