import { getSelectedItems } from "src/utils/files/utils";

export function getStorageList (state) {
  return state.storageList
}
export function getFilesList (state) {
  return state.filesList
}
export function getFoldersList (state) {
  return state.foldersList
}
export function getFilesQuota (state) {
  return state.filesQuota
}
export function getCurrentStorage (state) {
  return state.currentStorage
}
export function getLoadingStatus(state) {
  return state.isLoading
}
export function getCurrentPaths (state) {
  return state.currentPaths
}
export function getCurrentPath (state) {
  return state.currentPath
}
export function getCurrentFile (state) {
  return state.currentFile
}
export function getSelectedFiles(state) {
  const files = getSelectedItems(state.filesList)
  const folders = getSelectedItems(state.foldersList)
  return folders.concat(files)
}

export function getDialogComponent(state) {
  return state.dialogComponent ? state.dialogComponent : { component: '' }
}
