import AppApi from 'src/api'
import settings from 'src/settings'
import store from 'src/store'

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
}
