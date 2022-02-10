import VueCookies from 'vue-cookies'
import _ from 'lodash'

import core from 'src/core'
import enums from 'src/enums'
import types from 'src/utils/types'

export default {
  namespaced: true,

  state: {
    userPublicId: null,
    userRole: null,
    user: null,
    locale: 'en',
  },

  mutations: {
    setUserData (state, userData) {
      if (!_.isEmpty(userData)) {
        const UserRoles = enums.getUserRoles()
        // state.userId = typesUtils.pInt(userData.Id)
        // state.userName = typesUtils.pString(userData.Name)
        state.userPublicId = types.pString(userData.PublicId)
        state.userRole = types.pEnum(userData.Role, UserRoles, UserRoles.Anonymous)
        // state.userTenantId = typesUtils.pInt(userData.TenantId)
      }
    },

    setLocale: (state, locale) => (state.locale = locale),
  },

  actions: {
    setAuthToken: async ({ commit, getters }, authToken) => {
      VueCookies.set('AuthToken', authToken)
      await core.requestAppData()
    },

    parseAppData ({ commit }, appData) {
      commit('setUserData', appData.User)
    },

    logout: async ({ commit }) => {
      VueCookies.remove('AuthToken')
      await core.requestAppData()
    },

    setLocale: ({ commit }, locale) => commit('setLocale', locale),
  },

  getters: {
    isUserNormalOrTenant (state) {
      const UserRoles = enums.getUserRoles()
      return state.userRole === UserRoles.NormalUser || state.userRole === UserRoles.TenantAdmin
    },

    userPublicId: (state) => state.userPublicId,

    locale: (state) => state.locale,
  },
}
