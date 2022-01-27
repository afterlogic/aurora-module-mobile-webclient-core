import AppApi from 'src/api'
export default {
  asyncGetExternalsKeys: async ({ commit }) => {
    const externalKeys = await AppApi.openPGP.getExternalKeys()
    commit('SET_EXTERNAL_KEYS', externalKeys)
  },
}
