import webApi from 'src/api/web-api'

export default () => {
  return {
    getAppData: async () => {
      return webApi.sendRequest({
        moduleName: 'Core',
        methodName: 'GetAppData',
        parameters: {},
      }).then((result) => {
        if (result) {
          return result
        }
        return ''
      })
    },
  }
}
