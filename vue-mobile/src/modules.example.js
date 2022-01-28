// Run the "npm run prepare-files" command to create the modules.js file

export default {
  async getModules () {
    return [
      await import('src/manager'),
      await import('src/../../../ContactsMobileWebclient/vue-mobile/manager'),
      await import('src/../../../FilesMobileWebclient/vue-mobile/manager'),
      await import('src/../../../MailMobileWebclient/vue-mobile/manager'),
    ]
  },
}
