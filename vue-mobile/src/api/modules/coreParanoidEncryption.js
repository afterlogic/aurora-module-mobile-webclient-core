import webApi from 'src/api/web-api'

export default () => {
  return {
    setParanoidEncryptionSettings: async (parameters) => {
      return webApi.sendRequest({
        moduleName: 'CoreParanoidEncryptionWebclientPlugin',
        methodName: 'UpdateSettings',
        parameters: parameters,
      }).then((result) => {
        if (result) {
          return result
        }
        return false
      })
    },
  }
}
