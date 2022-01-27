export default {
  namespaced: true,
  state: {
    user: null,
    locale: 'en',
  },
  mutations: {
    SET_CURRENT_USER: (state, user) => (state.user = user),
    SET_LOCALE: (state, locale) => (state.locale = locale),
  },
  actions: {
    changeLocale: ({ commit }, locale) => commit('SET_LOCALE', locale),
    changeCurrentUser: ({ commit }, user) => commit('SET_CURRENT_USER', user),
  },
  getters: {
    currentUser(state) {
      return state.user
    },
    locale: (state) => state.locale,
  },
}
