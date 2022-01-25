import AppApi from 'src/api'
export default {
  asyncChangeParanoidEncryptionSettings: async ({}, parameters) => {
    return await AppApi.coreParanoidEncryption.setParanoidEncryptionSettings(
      parameters
    )
  },
}
