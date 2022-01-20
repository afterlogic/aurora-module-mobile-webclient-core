import { i18n, loadLanguageAsync } from 'boot/i18n'
import _ from 'lodash'
import types from 'src/utils/types'

class Settings {
  constructor(appData) {
    const coreData = types.pObject(appData.Core)
    this.shortLanguage = this._getShortLanguage(coreData)
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
  },
  getLocale: () => {
    return settings.shortLanguage
  },
}
