export default {
  async getModules () {
    return [
      await import('src/manager'),
      await import('src/../../../FilesMobileWebclient/vue-mobile/manager'),
    ]
  },
}
