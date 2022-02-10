import VueCookies from 'vue-cookies'
import _ from 'lodash'

import { i18n, loadLanguageAsync } from 'boot/i18n'
import types from 'src/utils/types'
import store from 'src/store'

class Settings {
  constructor(appData) {
    const coreData = types.pObject(appData.Core)
    this.shortLanguage = this._getShortLanguage(coreData)
    this.cookiePath = types.pString(coreData.CookiePath)
    this.cookieSecure = types.pBool(coreData.CookieSecure)
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
  init: async (appData) => {
    settings = new Settings(appData)
    if (
      !_.isEmpty(settings.shortLanguage) &&
      i18n.global.availableLocales.indexOf(settings.shortLanguage) !== -1
    ) {
      await loadLanguageAsync(settings.shortLanguage)
    }

    await store.dispatch('core/setLocale', settings.shortLanguage)

    if (process.env.NODE_ENV !== 'development') {
      VueCookies.config('', settings.cookiePath, '', settings.cookieSecure)
    }
  },
}
