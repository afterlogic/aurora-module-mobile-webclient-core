import WebApi from 'src/api/web-api'

export default () => {
  return {
    login: async (parameters) => {
      return WebApi.sendRequest({
        moduleName: 'Core',
        methodName: 'Login',
        parameters,
      }).then( result => {
        if (result && result?.AuthToken) {
          return result
        }
        return ''
      })
    }
  };
};
