import typesUtils from 'src/utils/types.js'
import AppApi from '/src/api/index'

export default {
  namespaced: true,
  state: {
    appData: false,
    user: null,
    locale: 'en',
  },
  mutations: {
    setAppData(state, appData) {
      state.appData = appData
    },
    SET_CURRENT_USER: (state, user) => (state.user = user),
    SET_LOCALE: (state, locale) => (state.locale = locale),
  },
  actions: {
    async asyncGetAppData({ commit }) {
      const appData = await AppApi.Core.getAppData()
      if (typesUtils.pObject(appData)) {
        commit('setAppData', appData)
      }
    },
    changeLocale: ({ commit }, locale) => commit('SET_LOCALE', locale),
    changeCurrentUser: ({ commit }, user) => commit('SET_CURRENT_USER', user),
  },
  getters: {
    getAppData(state) {
      return state.appData
    },
    currentUser(state) {
      return state.user
    },
    locale: (state) => state.locale,
  },
}
