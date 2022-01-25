import AppApi from 'src/api'
import settings from 'src/settings'
import store from 'src/store'
import DeviceUUID from 'device-uuid'
import VueCookies from 'vue-cookies'

const core = {
  appData: null,
  async requestAppData() {
    const appData = await AppApi.Core.getAppData()
    this.appData = appData
    settings.init(appData)
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
    const user = settings.getUser()
    await store.dispatch('core/changeCurrentUser', user)
  },
  addCookies() {
    const uuid = DeviceUUID.DeviceUUID().get()
    VueCookies.set('DeviceId', uuid)
  },
}
