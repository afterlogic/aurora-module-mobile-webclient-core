import files from './modules/files'
import user from './modules/user'
import core from './modules/core'
import contacts from 'src/api/modules/contacts'
import coreParanoidEncryption from 'src/api/modules/coreParanoidEncryption'
import openPGP from 'src/api/modules/openPGP'

export default {
  files: files(),
  user: user(),
  core: core(),
  contacts: contacts(),
  coreParanoidEncryption: coreParanoidEncryption(),
  openPGP: openPGP(),
}
