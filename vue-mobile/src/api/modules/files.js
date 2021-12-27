import WebApi from 'src/api/web-api'

export default () => {
  return {
    getFiles: async (parameters) => {
      return WebApi.sendRequest({
        moduleName: 'Files',
        methodName: 'GetFiles',
        parameters,
      }).then(result => {
        if (result) {
          return result
        }
        return false
      })
    },
    getStorages: async () => {
      return WebApi.sendRequest({
        moduleName: 'Files',
        methodName: 'GetStorages',
        parameters: {},
      }).then(result => {
        if (result) {
          return result
        }
        return false
      })
    },
    renameItem: async (parameters) => {
      return WebApi.sendRequest({
        moduleName: 'Files',
        methodName: 'Rename',
        parameters: parameters,
      }).then(result => {
        if (result) {
          return result
        }
        return false
      })
    }
  };
};
