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
    commit('setStorageList', storages)
    commit('setCurrentStorage', storages.length ? storages[0] : {})
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
export async function asyncGetFiles ({ commit, getters }, { path = '' }) {
  const currentStorage = getters['getCurrentStorage']
  const parameters = {
    Type: currentStorage?.Type,
    Path: path,
    Pattern: '',
    PathRequired: false
  }
  const data = await AppApi.Files.getFiles(parameters)
  if (types.pArray(data?.Items)) {
    const files = getParseFiles(data.Items)
    const folders = getParseFolders(data.Items)
    commit('setFoldersList', folders)
    commit('setFilesList', files)
  }
  if (types.pObject(data?.Quata)) {
    commit('setFilesQuota', data.Quata)
  }
}
export function changeCurrentStorage({ commit }, storage) {
  commit('setCurrentStorage', storage)
}
export function changeLoadingStatus({ commit }, status) {
  commit('setLoadingStatus', status)
}
export function changeCurrentPaths ({ state, commit, getters, dispatch }, { path, lastStorage = false }) {
  const currentPaths = getters['getCurrentPaths']
  let index = currentPaths.findIndex( elem => {
    return  elem?.path === path?.path
  })
  commit('setCurrentPath', { path: path?.path })
  commit('changeCurrentPath', { index, path, lastStorage })
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
  commit('setFileName', fileName)
}
export function selectFile({ commit }, file) {
  commit('setCurrentFile', file)
}
export function changeSelectStatus({ commit }) {
  commit('setSelectStatus')
}
export async function deleteItems ({ state, commit, getters, dispatch }, { items }) {
  const currentStorage = getters['getCurrentStorage']
  const currentPath = getters['getCurrentPath']
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
    commit('removeFolders', folders)
  }
  if (files.length) {
    commit('removeFiles', files)
  }
}
export function removeSelectedItems({ commit }, { items }) {
  commit('removeSelectedItems', items)
}