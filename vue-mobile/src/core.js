import _ from 'lodash'
import VueCookies from 'vue-cookies'
import { i18n } from 'boot/i18n'

import coreWebApi from 'src/api/core-web-api'
import store from 'src/store'
import enums from 'src/enums'

import DeviceUUID from 'device-uuid'

import errors from 'src/utils/errors'
import notification from 'src/utils/notification'

import modulesManager from 'src/modules-manager'

const core = {
  appData: null,

  setAppData (appData) {
    return new Promise(async (resolve, reject) => {
      this.appData = appData
      enums.init(appData)
      errors.init(appData)
      modulesManager.getModules(appData).then(() => {
        store.dispatch('core/parseAppData', appData).then(() => {
          modulesManager.initModules(appData)
          resolve()
        }, reject)
      }, reject)
    })
  },

  async requestAppData() {
    return new Promise(async (resolve, reject) => {
      const appData = await coreWebApi.getAppData()
      if (_.isObject(appData)) {
        this.setAppData(appData).then(() => {
          resolve()
        }, reject)
      } else {
        notification.showError(i18n.global.tc('COREWEBCLIENT.ERROR_UNKNOWN'))
        reject()
      }
    })
  },
}

export default {
  init() {
    return new Promise((resolve) => {
      if (core.appData === null) {
        this.addCookies()
        this.requestAppData().then(resolve)
      } else {
        resolve()
      }
    })
  },
  async requestAppData() {
    await core.requestAppData()
  },
  addCookies() {
    const uuid = DeviceUUID.DeviceUUID().get()
    VueCookies.set('DeviceId', uuid)
  },
}
