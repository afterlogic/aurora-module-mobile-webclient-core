import { getFilteredItems } from "src/utils/files/utils";

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
  const files = getFilteredItems(state.filesList, 'isSelected')
  const folders = getFilteredItems(state.foldersList, 'isSelected')
  return folders.concat(files)
}
export function getDialogComponent(state) {
  return state.dialogComponent ? state.dialogComponent : { component: '' }
}
export function getCopiedFiles(state) {
  return state.copyItems
}
export function getCopyMoveParameters(state) {
  const copiedFile = state.copyItems[0]
  const items = []
  state.copyItems.forEach( file => {
    items.push({
      FromPath: file.path,
      FromType: file.type,
      Name: file.name,
      IsFolder: file.isFolder
    })
  } )
  return {
    ToType: state.currentStorage.Type,
    ToPath: state.currentPath,
    FromType: copiedFile.type,
    FromPath: copiedFile.path,
    Files: items
  }
}
