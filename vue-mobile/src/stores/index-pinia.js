import { defineStore } from 'pinia';

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
    // The server has already put the AuthToken into an httpOnly cookie by this point
    // (it does so for any `X-Client: webclient` response that carries a token), so there's
    // nothing to store here — just reload AppData so the app picks up the authenticated user.
    setAuthToken: async () => {
      await core.requestAppData()
    },

    parseAppData (appData) {
      if (!_.isEmpty(appData.User)) {
        const UserRoles = enums.getUserRoles()
        this.userPublicId = types.pString(appData.User.PublicId)
        this.userRole = types.pEnum(appData.User.Role, UserRoles, UserRoles.Anonymous)
      }
    },

    // The Core/Logout response clears the httpOnly AuthToken cookie server-side
    // (CoreWebclient onAfterRunEntry), so there's nothing to remove here.
    logout: async () => {
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
