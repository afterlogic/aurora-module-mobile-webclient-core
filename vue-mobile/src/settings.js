import { i18n, loadLanguageAsync } from 'boot/i18n'
import _ from 'lodash'
import types from 'src/utils/types'
import VueCookies from 'vue-cookies'

class Settings {
  constructor(appData) {
    const coreData = types.pObject(appData.Core)
    this.shortLanguage = this._getShortLanguage(coreData)
    this.user = types.pObject(appData.User)
    this.cookiePath = types.pString(coreData.CookiePath)
    this.cookieSecure = types.pBool(coreData.CookieSecure)
    const twoFactorAuth = types.pObject(appData.TwoFactorAuth)
    this.allowUsedDevices = types.pBool(twoFactorAuth.AllowUsedDevices)
    this.trustDevicesForDays = types.pInt(twoFactorAuth.TrustDevicesForDays)
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

export default {
  init: (appData) => {
    settings = new Settings(appData)
    if (
      !_.isEmpty(settings.shortLanguage) &&
      i18n.global.availableLocales.indexOf(settings.shortLanguage) !== -1
    ) {
      loadLanguageAsync(settings.shortLanguage)
    }
    if (process.env.NODE_ENV !== 'development') {
      VueCookies.config('', settings.cookiePath, '', settings.cookieSecure)
    }
  },
  getLocale: () => {
    return settings.shortLanguage
  },
  getUser: () => {
    return settings?.user
  },
  getTwoFactorData: () => {
    return {
      allowUsedDevices: settings?.allowUsedDevices,
      trustDevicesForDays: settings?.trustDevicesForDays,
    }
  },
}
