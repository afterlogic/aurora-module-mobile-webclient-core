import VueCookies from 'vue-cookies'
import _ from 'lodash'

import { i18n, loadLanguageAsync } from 'boot/i18n'
import enums from 'src/enums'
import types from 'src/utils/types'
// import store from 'src/stores'

import { useCoreStore } from 'src/stores/index-pinia'
const coreStore = useCoreStore()

class Settings {
  constructor(appData) {
    const coreData = types.pObject(appData.Core)
    this.shortLanguage = this._getShortLanguage(coreData)
    this.language = types.pString(coreData.Language)
    this.cookiePath = types.pString(coreData.CookiePath)
    this.cookieSecure = types.pBool(coreData.CookieSecure)
    this.siteName = types.pString(coreData.SiteName)
    this.availableClientModules = types.pArray(coreData.AvailableClientModules)

    const brandingData = types.pObject(appData.BrandingWebclient)
    this.brandingLoginLogo = types.pString(brandingData.LoginLogo)
    this.brandingMobileLoginLogo = types.pString(brandingData.MobileLoginLogo)
    this.brandingProductName = types.pString(brandingData.ProductName)
  }

  _getShortLanguage(coreData) {
    let shortLanguage = types.pString(coreData.ShortLanguage, 'en')
    if (
      _.isEmpty(shortLanguage) ||
      i18n.global.availableLocales.indexOf(shortLanguage) === -1
    ) {
      if (i18n.global.availableLocales.indexOf('en') !== -1) {
        shortLanguage = 'en'
      } else if (!_.isEmpty(i18n.global.availableLocales)) {
        shortLanguage = i18n.global.availableLocales[0]
      }
    }
    return shortLanguage
  }
}

let settings = null

/**
 * Persist profile language for the next anonymous login (backend Api::GetLanguage).
 * Desktop login form writes the same cookie when the user picks a language there.
 */
function persistLoginLanguageCookie(appData) {
  if (!settings || _.isEmpty(settings.language)) {
    return
  }

  const UserRoles = enums.getUserRoles()
  const user = types.pObject(appData.User)
  if (_.isEmpty(user) || _.isEmpty(UserRoles)) {
    return
  }

  const role = types.pEnum(user.Role, UserRoles, UserRoles.Anonymous)
  if (role === UserRoles.Anonymous) {
    return
  }

  VueCookies.set(
    'aurora-lang-on-login',
    settings.language,
    60 * 60 * 24 * 30,
    settings.cookiePath || '/',
    '',
    settings.cookieSecure
  )
}

export default {
  init: async (appData) => {
    settings = new Settings(appData)
    if (
      !_.isEmpty(settings.shortLanguage) &&
      i18n.global.availableLocales.indexOf(settings.shortLanguage) !== -1
    ) {
      await loadLanguageAsync(settings.shortLanguage)
    }

    // await store.dispatch('core/setLocale', settings.shortLanguage)
    await coreStore.setLocale(settings.shortLanguage)

    if (process.env.NODE_ENV !== 'development') {
      VueCookies.config('', settings.cookiePath, '', settings.cookieSecure)
    }

    persistLoginLanguageCookie(appData)
  },

  getSetting(settingName) {
    return settings ? settings[settingName] : null
  },
}
