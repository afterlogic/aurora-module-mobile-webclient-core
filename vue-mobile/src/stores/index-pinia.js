import { defineStore } from 'pinia';

import VueCookies from 'vue-cookies'
import _ from 'lodash'

import core from 'src/core'
import enums from 'src/enums'
import types from 'src/utils/types'

export const useCoreStore = defineStore('CoreStore', {
  state: () => ({
    userPublicId: null,
    userRole: null,
    user: null,
    locale: 'en',
  }),
  actions: {
    setAuthToken: async (authToken) => {
      VueCookies.set('AuthToken', authToken)
      await core.requestAppData()
    },

    parseAppData (appData) {
      if (!_.isEmpty(appData.User)) {
        const UserRoles = enums.getUserRoles()
        this.userPublicId = types.pString(appData.User.PublicId)
        this.userRole = types.pEnum(appData.User.Role, UserRoles, UserRoles.Anonymous)
      }
    },

    logout: async () => {
      VueCookies.remove('AuthToken')
      await core.requestAppData()
    },

    setLocale (locale) { this.locale = locale }
  },
  getters: {
    isUserNormalOrTenant: (state) => {
      const UserRoles = enums.getUserRoles()
      return state.userRole === UserRoles.NormalUser || state.userRole === UserRoles.TenantAdmin
    },

    // userPublicId: (state) => state.userPublicId,
    userData: (state) => state.user,
    // locale: (state) => state.locale,
  },
});
