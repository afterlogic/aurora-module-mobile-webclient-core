import _ from 'lodash'
import VueCookies from 'vue-cookies'
import { i18n } from 'boot/i18n'

import coreWebApi from 'src/api/core-web-api'
// import store from 'src/stores'
import { useCoreStore } from 'src/stores/index-pinia'

import enums from 'src/enums'

import DeviceUUID from 'device-uuid'

import errors from 'src/utils/errors'
import notification from 'src/utils/notification'

import modulesManager from 'src/modules-manager'

const MAX_CONSECUTIVE_GET_APP_DATA_FAILURES = 10

const core = {
  appData: null,
  consecutiveGetAppDataFailures: 0,

  setAppData (appData) {
    return new Promise(async (resolve, reject) => {
      this.appData = appData
      enums.init(appData)
      errors.init(appData)
      modulesManager.getModules(appData).then(() => {
        // store.dispatch('core/parseAppData', appData).then(() => {
        const coreStore = useCoreStore()
        //  coreStore.parseAppData is not async
        coreStore.parseAppData(appData)
        modulesManager.initModules(appData)
        resolve()

        // coreStore.parseAppData(appData).then(() => {
        //   modulesManager.initModules(appData)
        //   resolve()
        // }, reject)
      }, reject)
    })
  },

  async requestAppData() {
    return new Promise(async (resolve, reject) => {
      try {
        const appData = await coreWebApi.getAppData()
        if (_.isObject(appData)) {
          this.consecutiveGetAppDataFailures = 0
          this.setAppData(appData).then(() => {
            resolve()
          }, reject)
          return
        }

        notification.showError(i18n.global.tc('COREWEBCLIENT.ERROR_UNKNOWN'))
        reject(new Error('Failed to load application data'))
      } catch (error) {
        this.consecutiveGetAppDataFailures += 1

        if (this.consecutiveGetAppDataFailures >= MAX_CONSECUTIVE_GET_APP_DATA_FAILURES) {
          reject(new Error('GetAppData failed 10 times in a row'))
          return
        }

        reject(error)
      }
    })
  },
}

export default {
  init() {
    return new Promise((resolve, reject) => {
      if (core.appData === null) {
        this.addCookies()
        this.requestAppData().then(resolve, reject)
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
