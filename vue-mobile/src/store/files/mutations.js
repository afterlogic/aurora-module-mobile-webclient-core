export function setStorageList (state, storages) {
  state.storageList = storages
}
export function setFilesList (state, filesList) {
  state.filesList = filesList
}
export function setFoldersList (state, foldersList) {
  state.foldersList = foldersList
}
export function setFilesQuota (state, filesQuota) {
state.filesQuota = filesQuota
}
export function setCurrentStorage (state, currentStorage) {
  state.currentStorage = currentStorage
}
export function setLoadingStatus (state, status) {
  state.isLoading = status
}
export function setCurrentPath (state, { path }) {
  state.currentPath = path
}
export function changeCurrentPath (state, { path, index, lastStorage }) {
  if (!lastStorage) {
    if (index === -1) {
      state.currentPaths.push(path)
    } else {
      state.currentPaths.splice(index + 1)
    }
  } else {
    state.currentPaths = [path]
  }
}
