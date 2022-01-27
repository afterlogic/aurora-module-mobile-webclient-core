import files from './files'
import user from './user'
import core from './core'
import contacts from './contacts'
import settings from './settings'
import openPGP from './openPGP'

import Vuex from 'vuex'

export default new Vuex.Store({
  modules: {
    user,
    files,
    core,
    contacts,
    settings,
    openPGP,
  },

  // enable strict mode (adds overhead!)
  // for dev mode and --debug builds only
  strict: process.env.DEBUGGING,
})
