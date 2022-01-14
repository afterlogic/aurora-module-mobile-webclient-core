export default function () {
  return {
    storageList: [],
    filesList: [],
    foldersList: [],
    copyItems: [],
    downloadFiles: [],
    filesQuota: {},
    currentStorage: '',
    currentHeader: '',
    isLoading: false,

    dialogComponent: null,

    currentFile: null,

    currentPath: '',
    currentPaths: [],
  }
}
