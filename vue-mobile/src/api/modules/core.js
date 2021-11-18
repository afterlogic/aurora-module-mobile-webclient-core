import WebApi from 'src/api/web-api'

export default () => {
  return {
    getAppData: async () => {
      return WebApi.sendRequest({
        moduleName: 'Core',
        methodName: 'GetAppData',
        parameters: {},
      }).then( result => {
        if (result) {
          return result
        }
        return ''
      })
    }
  };
};
