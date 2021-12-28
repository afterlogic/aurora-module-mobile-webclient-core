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
export function setCurrentFile (state, file) {
  state.currentFile = file
}
export function setFileName (state, fileName) {
  state.currentFile.name = fileName
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

export function removeFolders (state, folders) {
  folders.forEach( folder => {
    const itemIndex = state.foldersList.findIndex( item => item.hash === folder.hash )
    if (itemIndex !== -1) {
      state.folderList.splice(itemIndex, 1)
    }
  })
}
export function removeFiles (state, files) {
  files.forEach( file => {
    const itemIndex = state.filesList.findIndex( item => item.hash === file.hash )
    if (itemIndex !== -1) {
      state.filesList.splice(itemIndex, 1)
    }
  })
}
export function setSelectStatus(state) {
  state.currentFile.isSelected = !state.currentFile.isSelected
}
export function removeSelectedItems(state, items) {
  if (items.length) {
    items.forEach( item => {
      item.isSelected = false
    })
  }
}
export function setDialogComponent(state, dialogComponent) {
  state.dialogComponent = dialogComponent
}
