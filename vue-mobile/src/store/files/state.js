export default function () {
  return {
    storageList: [],
    filesList: [],
    foldersList: [],
    filesQuota: {},
    currentStorage: '',
    isLoading: false,

    dialogComponent: null,

    currentFile: null,

    currentPath: '',
    currentPaths: [],
  }
}
