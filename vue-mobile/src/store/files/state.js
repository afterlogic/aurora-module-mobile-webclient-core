export default function () {
  return {
    storageList: [],
    filesList: [],
    foldersList: [],
    filesQuota: {},
    currentStorage: '',
    isLoading: false,

    currentFile: null,

    currentPath: '',
    currentPaths: [],
  }
}
