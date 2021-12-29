import AppApi from '/src/api/index'
import types from "src/utils/types";
import {
  getParseFiles,
  getParseFolders,
  getFiles,
  getFolders
} from "src/utils/files/utils";

export async function asyncGetStorages ({ commit, dispatch }) {
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
}
export async function asyncGetFiles ({ commit, getters }) {
  const currentStorage = getters['currentStorage']
  const currentPath = getters['currentPath']
  const parameters = {
    Type: currentStorage?.Type,
    Path: currentPath,
    Pattern: '',
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
}
export function changeCurrentStorage({ commit }, storage) {
  commit('SET_CURRENT_STORAGE', storage)
}
export function changeLoadingStatus({ commit }, status) {
  commit('SET_LOADING_STATUS', status)
}
export function changeCurrentPaths ({ state, commit, getters, dispatch }, { path, lastStorage = false }) {
  const currentPaths = getters['currentPaths']
  let index = currentPaths.findIndex( elem => {
    return  elem?.path === path?.path
  })
  commit('SET_CURRENT_PATH', { path: path?.path })
  commit('CHANGE_CURRENT_PATH', { index, path, lastStorage })
}
export async function asyncRenameItem ({ state }, { file, itemName }) {
  const parameters = {
    Type: state.currentStorage.Type,
    Path: file.path,
    Name: file.name,
    NewName: itemName,
    IsLink: 0,
    IsFolder: file.isFolder
  }
  return await AppApi.Files.renameItem(parameters)
}
export function changeFileName({ commit }, fileName) {
  commit('SET_FILE_NAME', fileName)
}
export function selectFile({ commit }, file) {
  commit('SET_CURRENT_FILE', file)
}
export function changeSelectStatus({ commit }) {
  commit('SET_SELECT_STATUS')
}
export async function deleteItems ({ state, commit, getters, dispatch }, { items }) {
  const currentStorage = getters['currentStorage']
  const currentPath = getters['currentPath']
  const parameters = {
    Type: currentStorage?.Type,
    Path: currentPath,
    Items: items
  }
  return await AppApi.Files.deleteItems(parameters)
}

export function changeItemsLists({ commit }, { items }) {
  const files = getFiles(items)
  const folders = getFolders(items)

  if (folders.length) {
    commit('REMOVE_FOLDERS', folders)
  }
  if (files.length) {
    commit('REMOVE_FILES', files)
  }
}
export function removeSelectedItems({ commit }, { items }) {
  commit('REMOVE_SELECTED_ITEMS', items)
}
export function changeDialogComponent({ commit }, dialogComponent) {
  console.log(dialogComponent, 'dialogComponent')
  commit('SET_DIALOG_COMPONENT', dialogComponent)
}
export function addCopyItems({ commit }, { items }) {
  commit('SET_COPY_ITEMS', items)
  commit('SET_ITEMS_COPY_STATUS', { items, status: true })
}
export function removeCopiedFiles({ commit }) {
  commit('SET_COPY_ITEMS_STATUS', { status: false })
  commit('REMOVE_COPIED_FILES')
}
export async function copyItems({ dispatch, getters }) {
  const parameters = getters['getCopyMoveParameters']
  const result = await AppApi.Files.copyMoveItems(parameters, 'Copy')
  if (result) {
    dispatch('removeCopiedFiles')
    dispatch('asyncGetFiles')
  }
}
export async function moveItems({ dispatch, getters }) {
  const parameters = getters['getCopyMoveParameters']
  const result = await AppApi.Files.copyMoveItems(parameters, 'Move')
  if (result) {
    dispatch('removeCopiedFiles')
    dispatch('asyncGetFiles')
  }
}
export async function createFolder({ dispatch, getters }, { name }) {
  const currentStorage = getters['currentStorage']
  const parameters = {
    Type: currentStorage.Type,
    Path: getters['currentPath'],
    FolderName: name
  }
  return await AppApi.Files.createFolder(parameters)
}
