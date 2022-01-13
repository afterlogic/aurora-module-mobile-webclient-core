export default function () {
  return {
    storageList: [],
    filesList: [],
    foldersList: [],
    copyItems: [],
    downloadFiles: [],
    filesQuota: {},
    currentStorage: '',
    isLoading: false,

    dialogComponent: null,

    currentFile: null,

    currentPath: '',
    currentPaths: [],
  }
}
