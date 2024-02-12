export default {
  async getModules () {
    return [
      await import('src/manager'),
      await import('src/../../../ContactsMobileWebclient/vue-mobile/manager'),
      await import('src/../../../CoreParanoidEncryptionWebclientPlugin/vue-mobile/manager'),
      await import('src/../../../FilesMobileWebclient/vue-mobile/manager'),
      await import('src/../../../MailMobileWebclient/vue-mobile/manager'),
      await import('src/../../../OpenPgpFilesMobileWebclient/vue-mobile/manager'),
      await import('src/../../../OpenPgpMobileWebclient/vue-mobile/manager'),
      await import('src/../../../SettingsMobileWebclient/vue-mobile/manager'),
      await import('src/../../../StandardLoginFormMobileWebclient/vue-mobile/manager'),
      await import('src/../../../TwoFactorAuth/vue-mobile/manager'),
    ]
  },
}
