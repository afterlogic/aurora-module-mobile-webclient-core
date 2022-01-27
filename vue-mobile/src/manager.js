import settings from 'src/settings'

export default {
  moduleName: 'CoreMobileWebclient',

  requiredModules: [],

  init (appData) {
    settings.init(appData)
  },
}
