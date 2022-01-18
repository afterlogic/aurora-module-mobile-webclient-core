import AppApi from '/src/api/index'
import types from "src/utils/types";
import {
  getParseFiles,
  getParseFolders,
  getFiles,
  getFolders
} from "src/utils/files/utils";

export default {
  asyncGetStorages:  async ({ commit, dispatch }) => {
    const storages = await AppApi.Files.getStorages()
    if (types.pArray(storages)) {
      commit('SET_STORAGE_LIST', storages)
      commit('SET_CURRENT_STORAGE', storages.length ? storages[0] : {})
      if (storages.length) {
        const path = {
          path: '',
          name: storages[0].DisplayName,
        }
        dispatch('changeCurrentPaths', {
          path,
          lastStorage: true
        })
      }
    }
  },
  asyncGetFiles:  async ({ commit, getters, dispatch }) => {
    dispatch('changeLoadingStatus', true)
    const currentStorage = getters['currentStorage']
    const currentPath = getters['currentPath']
    const parameters = {
      Type: currentStorage?.Type,
      Path: currentPath,
      Pattern: getters['searchText'],
      PathRequired: false
    }
    const data = await AppApi.Files.getFiles(parameters)
    if (types.pArray(data?.Items)) {
      const files = getParseFiles(data.Items)
      const folders = getParseFolders(data.Items)
      commit('SET_FOLDERS_LIST', folders)
      commit('SET_FILES_LIST', files)
    }
    if (types.pObject(data?.Quata)) {
      commit('SET_FILES_QUOTA', data.Quata)
    }
    dispatch('changeLoadingStatus', false)
  },
  changeCurrentStorage: ({ commit }, storage) => {
    commit('SET_CURRENT_STORAGE', storage)
  },
  changeLoadingStatus: ({ commit }, status) => {
    commit('SET_LOADING_STATUS', status)
  },
  changeCurrentPaths:  ({ state, commit, getters, dispatch }, { path, lastStorage = false }) => {
    const currentPaths = getters['currentPaths']
    let index = currentPaths.findIndex( elem => {
      return  elem?.path === path?.path
    })
    commit('SET_CURRENT_PATH', { path: path?.path })
    commit('CHANGE_CURRENT_PATH', { index, path, lastStorage })
  },
  asyncRenameItem:  async ({ state }, { file, itemName }) => {
    const parameters = {
      Type: state.currentStorage.Type,
      Path: file.path,
      Name: file.name,
      NewName: itemName,
      IsLink: 0,
      IsFolder: file.isFolder
    }
    return await AppApi.Files.renameItem(parameters)
  },
  changeFileName: ({ commit }, fileName) => {
    commit('SET_FILE_NAME', fileName)
  },
  selectFile: ({ commit }, file) => {
    commit('SET_CURRENT_FILE', file)
  },
  changeSelectStatus: ({ commit }) => {
    commit('SET_SELECT_STATUS')
  },
  asyncDeleteItems:  async ({ state, commit, getters, dispatch }, { items }) => {
    const currentStorage = getters['currentStorage']
    const currentPath = getters['currentPath']
    const parameters = {
      Type: currentStorage?.Type,
      Path: currentPath,
      Items: items
    }
    return await AppApi.Files.deleteItems(parameters)
  },

  changeItemsLists: ({ commit }, { items }) => {
    const files = getFiles(items)
    const folders = getFolders(items)

    if (folders.length) {
      commit('REMOVE_FOLDERS', folders)
    }
    if (files.length) {
      commit('REMOVE_FILES', files)
    }
  },
  removeSelectedItems: ({ commit }, { items }) => {
    commit('REMOVE_SELECTED_ITEMS', items)
  },
  changeDialogComponent: ({ commit }, dialogComponent) => {
    commit('SET_DIALOG_COMPONENT', dialogComponent)
  },
  addCopyItems: ({ commit }, { items }) => {
    commit('SET_COPY_ITEMS', items)
    commit('SET_ITEMS_COPY_STATUS', { items, status: true })
  },
  removeCopiedFiles: ({ commit }) => {
    commit('SET_COPY_ITEMS_STATUS', { status: false })
    commit('REMOVE_COPIED_FILES')
  },
  copyItems: async ({ dispatch, getters }) => {
    const parameters = getters['getCopyMoveParameters']
    const result = await AppApi.Files.copyMoveItems(parameters, 'Copy')
    if (result) {
      dispatch('removeCopiedFiles')
      dispatch('asyncGetFiles')
    }
  },
  moveItems: async ({ dispatch, getters }) => {
    const parameters = getters['getCopyMoveParameters']
    const result = await AppApi.Files.copyMoveItems(parameters, 'Move')
    if (result) {
      dispatch('removeCopiedFiles')
      dispatch('asyncGetFiles')
    }
  },
  asyncCreateFolder: async ({ dispatch, getters }, { name }) => {
    const currentStorage = getters['currentStorage']
    const parameters = {
      Type: currentStorage.Type,
      Path: getters['currentPath'],
      FolderName: name
    }
    return await AppApi.Files.createFolder(parameters)
  },
  asyncCreateShareableLink: async ({ commit, getters }, { withPassword }) => {
    const currentFile = getters['currentFile']
    const parameters = {
      Type: currentFile.type,
      Path: currentFile.path,
      Name: currentFile.name,
      Size: currentFile.size,
      IsFolder: currentFile.isFolder,
      RecipientEmail: '',
      PgpEncryptionMode: '',
      Password: withPassword ? '1234567890' : '',
    }
    const module = withPassword ? 'OpenPgpFilesWebclient' : 'Files'
    const result = await AppApi.Files.createShareableLink(parameters, module)
    if (result) {
      commit(
        'SET_ITEM_PROPERTY',
        {
          item: currentFile,
          property: 'publicLink',
          value: `https://aurora.afterlogic.com/${result}`
        }
      )
      if (parameters.Password) {
        commit(
          'SET_ITEM_PROPERTY',
          { item: currentFile, property: 'linkPassword', value: parameters.Password }
        )
      }
      return result
    }
    return result
  },
  asyncDeletePublicLink: async ({ commit, getters }) => {
    const currentFile = getters['currentFile']
    const parameters = {
      Type: currentFile.type,
      Path: currentFile.path,
      Name: currentFile.name,
    }
    const result = await AppApi.Files.deletePublicLink(parameters)
    if (result) {
      commit(
        'SET_ITEM_PROPERTY',
        { item: currentFile, property: 'publicLink', value: '' }
      )
      commit(
        'SET_ITEM_PROPERTY',
        { item: currentFile, property: 'linkPassword', value: '' }
      )
    }
    return result
  },
  asyncUpdateShare: async ({ commit, getters }, parameters) => {
    const result = await AppApi.Files.updateShare(parameters)
    if (result) {
      const currentFile = getters['currentFile']
      commit(
        'SET_ITEM_PROPERTY',
        { item: currentFile, property: 'shares', value: parameters.Shares }
      )
      return true
    }
    return false
  },
  asyncGetHistory: async ({ state, commit, getters, dispatch }, { resourceType, resourceId, offset, limit }) => {
    const parameters = {
      ResourceType: resourceType,
      ResourceId: resourceId,
      Offset: offset,
      Limit: limit
    }
    return AppApi.Files.getHistory(parameters)
  },
  asyncClearHistory: async ({ state, commit, getters, dispatch }, { resourceType, resourceId }) => {
    const parameters = {
      ResourceType: resourceType,
      ResourceId: resourceId,
    }
    return AppApi.Files.clearHistory(parameters)
  },
  addDownloadsFiles: ({ state, commit, getters, dispatch }, files) => {
    commit('SET_DOWNLOADS_FILES', files)
  },
  removeUploadedFiles: ({ commit }) => {
    commit('REMOVE_UPLOADED_FILES')
  },
  changeUploadingStatus: ({ commit }, { file, status }) => {
    commit(
      'SET_ITEM_PROPERTY',
      { item: file, property: 'isUploading', value: status }
    )
  },
  changeItemProperty: ({ commit }, { item, property, value }) => {
    commit(
      'SET_ITEM_PROPERTY',
      { item, property, value }
    )
  },
  asyncDownloadFile: async ({ getters }) => {
    const file = getters['currentFile']
    await AppApi.Files.downloadFile(file)
  },
  changeCurrentHeader: ({ commit }, headerName) => {
    commit('SET_CURRENT_HEADER_NAME', headerName)
  },
  changeSearchText: ({ commit }, text) => {
    commit('SET_SEARCH_TEXT', text)
  }
}
