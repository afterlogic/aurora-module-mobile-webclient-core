import _ from 'lodash'

import eventBus from 'src/event-bus'
import settings from 'src/settings'
import { switchToDesktopVersion } from 'src/utils/mobile-layout'

const _getSettingsPreLogoutItems = (params) => {
  if (!_.isArray(params.preLogoutItems)) {
    params.preLogoutItems = []
  }

  params.preLogoutItems = params.preLogoutItems.concat([
    {
      labelLangConst: 'COREWEBCLIENT.ACTION_SHOW_FULL_VERSION',
      getIconComponent: () => import('./components/icons/FullVersionIcon'),
      onClick: () => {
        switchToDesktopVersion()
      },
    },
  ])
}

export default {
  moduleName: 'CoreMobileWebclient',

  requiredModules: [],

  init (appData) {
    settings.init(appData)
  },

  initSubscriptions () {
    eventBus.$off('SettingsMobileWebclient::GetSettingsPreLogoutItems', _getSettingsPreLogoutItems)
    eventBus.$on('SettingsMobileWebclient::GetSettingsPreLogoutItems', _getSettingsPreLogoutItems)
  },
}
