import files from './modules/files'
import user from './modules/user'
import core from './modules/core'
import contacts from "src/api/modules/contacts";

export default {
  Files: files(),
  User: user(),
  Core: core(),
  Contacts: contacts()
}
