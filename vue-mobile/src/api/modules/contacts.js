import webApi from 'src/api/web-api'

export default () => {
  return {
    getContactSuggestions: async (parameters) => {
      return webApi.sendRequest({
        moduleName: 'Contacts',
        methodName: 'GetContactSuggestions',
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
