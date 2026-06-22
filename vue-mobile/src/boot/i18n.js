import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'

import messages from 'src/i18n'

const loadedLanguages = ['en']

export const i18n = createI18n({
  legacy: true,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
})

function setI18nLanguage(lang) {
  i18n.global.locale = lang
  document.querySelector('html')?.setAttribute('lang', lang)
  return lang
}

export function loadLanguageAsync(lang) {
  const currentLocale = i18n.global.locale
  if (currentLocale === lang) {
    return Promise.resolve(setI18nLanguage(lang))
  }

  if (loadedLanguages.includes(lang)) {
    return Promise.resolve(setI18nLanguage(lang))
  }

  return import('../i18n/' + lang + '/index.json').then((messages) => {
    i18n.global.setLocaleMessage(lang, messages.default)
    loadedLanguages.push(lang)
    return setI18nLanguage(lang)
  })
}

export default defineBoot(({ app }) => {
  app.use(i18n)
})
