import WebApi from 'src/api/web-api'
import _ from 'lodash'

const i18n = {
  '$t': {
    OPENPGPFILESWEBCLIENT: {
    },
    SHAREDFILES: {
    },
    COREWEBCLIENT: {
    },
    FILESWEBCLIENT: {
      "ERROR_FILES_MOVE_PLURAL": "File moving has failed.|Files moving has failed.",
      "ERROR_INVALID_FOLDER_NAME": "Invalid folder name",
    }
  }
}
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
        return []
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
        return []
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
        defaultText: i18n.$t.FILESWEBCLIENT.ERROR_FILES_MOVE_PLURAL
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
        defaultText: i18n.$t.FILESWEBCLIENT.ERROR_INVALID_FOLDER_NAME
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
    },
    updateShare: async (parameters) => {
      return WebApi.sendRequest({
        moduleName: 'SharedFiles',
        methodName: 'UpdateShare',
        parameters: parameters,
      }).then(result => {
        if (result) {
          return result
        }
        return false
      })
    },
    getHistory: async (parameters) => {
      return WebApi.sendRequest({
        moduleName: 'ActivityHistory',
        methodName: 'GetList',
        parameters: parameters,
      }).then(result => {
        if (result) {
          return result
        }
        return false
      })
    },
    clearHistory: async (parameters) => {
      return WebApi.sendRequest({
        moduleName: 'ActivityHistory',
        methodName: 'Delete',
        parameters: parameters,
      }).then(result => {
        if (result) {
          return result
        }
        return false
      })
    },
    downloadFile: async (file) => {
      const parameters = {
        downloadUrl: file.downloadUrl,
        fileName: file.name,
        file
      }
      return WebApi.downloadByUrl(parameters).then(result => {
        if (result) return result
        return false
      }).catch(err => {
        console.log(err)
      })
    }
  };
};
