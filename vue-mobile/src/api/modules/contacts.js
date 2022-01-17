import WebApi from 'src/api/web-api'

export default () => {
  return {
    getContactSuggestions: async (parameters) => {
      return WebApi.sendRequest({
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
