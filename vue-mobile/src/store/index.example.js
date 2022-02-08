// Run the "npm run prepare-files" command to create the index.js file

import Vuex from 'vuex'

import core from './core'
import contactsmobile from 'src/../../../ContactsMobileWebclient/vue-mobile/store'
import filesmobile from 'src/../../../FilesMobileWebclient/vue-mobile/store'
import mailmobile from 'src/../../../MailMobileWebclient/vue-mobile/store'

export default new Vuex.Store({
  modules: {
    core,
    contactsmobile,
    filesmobile,
    mailmobile,
  },

  strict: process.env.DEBUGGING
})
