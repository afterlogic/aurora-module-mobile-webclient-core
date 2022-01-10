import WebApi from 'src/api/web-api'
import _ from 'lodash'

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
    },
    deleteItems: async (parameters) => {
      return WebApi.sendRequest({
        moduleName: 'Files',
        methodName: 'Delete',
        parameters: parameters,
      }).then(result => {
        if (result) {
          return result
        }
        return false
      })
    },
    copyMoveItems: async (parameters, method) => {
      return WebApi.sendRequest({
        moduleName: 'Files',
        methodName: method,
        parameters: parameters,
      }).then(result => {
        if (result) {
          return result
        }
        return false
      })
    },
    createFolder: async (parameters) => {
      return WebApi.sendRequest({
        moduleName: 'Files',
        methodName: 'CreateFolder',
        parameters: parameters,
      }).then(result => {
        if (result) {
          return result
        }
        return false
      })
    },
    createShareableLink: async (parameters, module) => {
      return WebApi.sendRequest({
        moduleName: module,
        methodName: 'CreatePublicLink',
        parameters: parameters,
      }).then(result => {
        if (_.isString(result?.link)) return result.link
        if (result) return result
        return false
      })
    },
    deletePublicLink: async (parameters) => {
      return WebApi.sendRequest({
        moduleName: 'Files',
        methodName: 'DeletePublicLink',
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
