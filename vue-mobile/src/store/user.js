import _ from 'lodash'
import VueCookies from 'vue-cookies'

import AppApi from '/src/api/index'
import core from 'src/core'
import enums from 'src/enums'
import typesUtils from 'src/utils/types'

export default {
  namespaced: true,

  state: {
    hasAuthToken: false,

    userPublicId: null,
    userRole: null,
  },

  mutations: {
    changeAuthTokenStatus: (state, status) => (state.hasAuthToken = status),

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
    parseAppData ({ commit }, appData) {
      commit('setUserData', appData.User)
    },
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
    getUsedDevices: async ({ commit }, payload) => {
      return await AppApi.User.getUsedDevices(payload)
    },
    init: ({ commit }) => {
      const authToken = VueCookies.get('AuthToken')
      commit('changeAuthTokenStatus', !!authToken)
    },
    logout: ({ commit }) => {
      VueCookies.remove('AuthToken')
      commit('changeAuthTokenStatus', false)
    },
  },

  getters: {
    getAuthTokenStatus: (state) => {
      return state.hasAuthToken
    },
    isUserNormalOrTenant (state) {
      const UserRoles = enums.getUserRoles()
      return state.userRole === UserRoles.NormalUser || state.userRole === UserRoles.TenantAdmin
    },
  },
}
