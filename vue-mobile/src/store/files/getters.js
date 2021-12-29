import { getFilteredItems } from "src/utils/files/utils";

export function storageList (state) {
  return state.storageList
}
export function filesList (state) {
  return state.filesList
}
export function foldersList (state) {
  return state.foldersList
}
export function filesQuota (state) {
  return state.filesQuota
}
export function currentStorage (state) {
  return state.currentStorage
}
export function loadingStatus(state) {
  return state.isLoading
}
export function currentPaths (state) {
  return state.currentPaths
}
export function currentPath (state) {
  return state.currentPath
}
export function currentFile (state) {
  return state.currentFile
}
export function selectedFiles(state) {
  const files = getFilteredItems(state.filesList, 'isSelected')
  const folders = getFilteredItems(state.foldersList, 'isSelected')
  return folders.concat(files)
}
export function dialogComponent(state) {
  return state.dialogComponent ? state.dialogComponent : { component: '' }
}
export function copiedFiles(state) {
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
