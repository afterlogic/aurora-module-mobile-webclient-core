import _ from 'lodash'
import VueCookies from 'vue-cookies'

import appApi from '/src/api/index'
import core from 'src/core'
import enums from 'src/enums'
import typesUtils from 'src/utils/types'

export default {
  namespaced: true,

  state: {
    userPublicId: null,
    userRole: null,
  },

  mutations: {
    setUserData (state, userData) {
      if (!_.isEmpty(userData)) {
        const UserRoles = enums.getUserRoles()
        // state.userId = typesUtils.pInt(userData.Id)
        // state.userName = typesUtils.pString(userData.Name)
        state.userPublicId = typesUtils.pString(userData.PublicId)
        state.userRole = typesUtils.pEnum(userData.Role, UserRoles, UserRoles.Anonymous)
        // state.userTenantId = typesUtils.pInt(userData.TenantId)
      }
    },
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

    confirmTwoFactorAuth: async ({ commit }, payload) => {
      const response = await appApi.user.confirmTwoFactorAuth(payload)
      if (response?.AuthToken) {
        VueCookies.set('AuthToken', response.AuthToken)
        await core.requestAppData()
      }
    },
    trustTheDevice: async ({ commit }, payload) => {
      const response = await appApi.user.trustTheDevice(payload)
      console.log('DB: response trust', response)
    },
    getUsedDevices: async ({ commit }, payload) => {
      return await appApi.user.getUsedDevices(payload)
    },
  },

  getters: {
    isUserNormalOrTenant (state) {
      const UserRoles = enums.getUserRoles()
      return state.userRole === UserRoles.NormalUser || state.userRole === UserRoles.TenantAdmin
    },
  },
}
