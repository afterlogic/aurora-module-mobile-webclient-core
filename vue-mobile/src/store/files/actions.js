import AppApi from '/src/api/index'
import types from "src/utils/types";

export async function asyncGetStorages ({ commit }) {
  const storages = await AppApi.Files.getStorages()
  if (types.pArray(storages)) {
    commit('setStorageList', storages)
    commit('setCurrentStorage', storages.length ? storages[0] : {})
  }
}
export async function asyncGetFiles ({ commit, getters }) {
  const currentStorage = getters['getCurrentStorage']
  const parameters = {
    Type: currentStorage?.Type,
    Path: '',
    Pattern: '',
    PathRequired: false
  }
  const files = await AppApi.Files.getFiles(parameters)
  if (types.pArray(files?.Items)) {
    commit('setFilesList', files.Items)
  }
  if (types.pObject(files?.Quata)) {
    commit('setFilesQuota', files.Quata)
  }
}
