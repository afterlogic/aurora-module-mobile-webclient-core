import files from './files'
import user from './user'
import core from './core'
import contacts from './contacts'
import Vuex from 'vuex'

export default new Vuex.Store({
  modules: {
    user,
    files,
    core,
    contacts,
  },

  // enable strict mode (adds overhead!)
  // for dev mode and --debug builds only
  strict: process.env.DEBUGGING,
})
