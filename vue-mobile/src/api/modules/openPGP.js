import WebApi from 'src/api/web-api'

export default () => {
  return {
    getExternalKeys: async () => {
      return WebApi.sendRequest({
        moduleName: 'OpenPgpWebclient',
        methodName: 'GetPublicKeysFromContacts',
        parameters: {},
      })
        .then((result) => {
          if (result) {
            return result
          }
          return []
        })
        .catch(() => {
          return []
        })
    },
    addPublicKeys: async (parameters) => {
      return WebApi.sendRequest({
        moduleName: 'OpenPgpWebclient',
        methodName: 'AddPublicKeysToContacts',
        parameters: parameters,
      })
        .then((result) => {
          if (result) {
            return result
          }
          return []
        })
        .catch(() => {
          return []
        })
    },
  }
}
