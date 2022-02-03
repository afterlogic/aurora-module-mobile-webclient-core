import appApi from 'src/api'
export default {
  asyncChangeParanoidEncryptionSettings: async ({}, parameters) => {
    return await appApi.coreParanoidEncryption.setParanoidEncryptionSettings(
      parameters
    )
  },
}
