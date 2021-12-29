export function SET_STORAGE_LIST (state, storages) {
  state.storageList = storages
}
export function SET_FILES_LIST (state, filesList) {
  state.filesList = filesList
}
export function SET_FOLDERS_LIST (state, foldersList) {
  state.foldersList = foldersList
}
export function SET_FILES_QUOTA (state, filesQuota) {
state.filesQuota = filesQuota
}
export function SET_CURRENT_STORAGE (state, currentStorage) {
  state.currentStorage = currentStorage
}
export function SET_LOADING_STATUS (state, status) {
  state.isLoading = status
}
export function SET_CURRENT_PATH (state, { path }) {
  state.currentPath = path
}
export function SET_CURRENT_FILE (state, file) {
  state.currentFile = file
}
export function SET_FILE_NAME (state, fileName) {
  state.currentFile.name = fileName
}
export function CHANGE_CURRENT_PATH (state, { path, index, lastStorage }) {
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

export function REMOVE_FOLDERS (state, folders) {
  folders.forEach( folder => {
    const itemIndex = state.foldersList.findIndex( item => item.hash === folder.hash )
    if (itemIndex !== -1) {
      state.folderList.splice(itemIndex, 1)
    }
  })
}
export function REMOVE_FILES (state, files) {
  files.forEach( file => {
    const itemIndex = state.filesList.findIndex( item => item.hash === file.hash )
    if (itemIndex !== -1) {
      state.filesList.splice(itemIndex, 1)
    }
  })
}
export function SET_SELECT_STATUS(state) {
  state.currentFile.isSelected = !state.currentFile.isSelected
}
export function REMOVE_SELECTED_ITEMS(state, items) {
  if (items.length) {
    items.forEach( item => {
      item.isSelected = false
    })
  }
}
export function SET_DIALOG_COMPONENT(state, dialogComponent) {
  state.dialogComponent = dialogComponent
}
export function SET_COPY_ITEMS(state, items) {
  state.copyItems = items
}
export function SET_ITEMS_COPY_STATUS(state, { items, status }) {
  items.forEach( item => {
    item.isCopied = status
  })
}
export function SET_COPY_ITEMS_STATUS(state, { status }) {
  state.filesList.forEach(item => {
    if (item.isCopied) {
      item.isCopied = status
    }
  })
  state.foldersList.forEach(item => {
    if (item.isCopied) {
      item.isCopied = status
    }
  })
}
export function REMOVE_COPIED_FILES(state) {
  state.copyItems = []
}
