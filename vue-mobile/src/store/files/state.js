export default function () {
  return {
    storageList: [],
    filesList: [],
    foldersList: [],
    copyItems: [],
    filesQuota: {},
    currentStorage: '',
    isLoading: false,

    dialogComponent: null,

    currentFile: null,

    currentPath: '',
    currentPaths: [],
  }
}
