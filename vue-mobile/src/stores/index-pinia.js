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
      const UserRoles = enums.getUserRoles()
      const anonymousRole = UserRoles.Anonymous ?? null
      const user = types.pObject(appData?.User)
      const hasUser = !_.isEmpty(user)

      this.user = hasUser ? user : null
      this.userPublicId = hasUser ? types.pString(user.PublicId) : null
      this.userRole = hasUser ? types.pEnum(user.Role, UserRoles, anonymousRole) : anonymousRole
    },

    // The Core/Logout response clears the httpOnly AuthToken cookie server-side
    // (CoreWebclient onAfterRunEntry). Do not reload AppData here: if the server
    // rejected the token, doing so can recursively re-trigger GetAppData -> Logout.
    logout () {
      const UserRoles = enums.getUserRoles()
      this.user = null
      this.userPublicId = null
      this.userRole = UserRoles.Anonymous ?? null
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
