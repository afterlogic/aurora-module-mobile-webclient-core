import AppApi from 'src/api'
export default {
  asyncGetExternalsKeys: async ({ commit }) => {
    const externalKeys = await AppApi.openPGP.getExternalKeys()
    commit('SET_EXTERNAL_KEYS', externalKeys)
  },
  asyncAddPublicKeys: async ({ commit }, keys) => {
    const result = AppApi.openPGP.addPublicKeys({Keys: keys})
    if (result) {
      commit('SET_EXTERNAL_KEYS', keys)
    }
    return result
  },
  changeCurrentKeys: ({ commit }, keys) => {
    commit('SET_CURRENT_KEYS', keys)
  }
}
