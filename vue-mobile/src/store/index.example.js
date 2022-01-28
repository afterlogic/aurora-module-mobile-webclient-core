// Run the "npm run prepare-files" command to create the index.js file

import Vuex from 'vuex'

import core from './core'
import user from './user'
import contacts from './contacts'
import files from './files'
import settings from './settings'

export default new Vuex.Store({
  modules: {
    core,
    user,
    contacts,
    files,
    settings,
  },

  strict: process.env.DEBUGGING
})
