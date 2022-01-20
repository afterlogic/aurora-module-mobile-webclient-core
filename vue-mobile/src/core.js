import AppApi from 'src/api'
import settings from 'src/settings'

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
    return new Promise((resolve, reject) => {
      if (core.appData === null) {
        core.requestAppData().then(resolve, reject)
      } else {
        resolve()
      }
    })
  },
  async requestAppData() {
    await core.requestAppData()
  },
}
