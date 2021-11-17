import axios from 'axios';

import files from './modules/files'
import user from './modules/user'

export default {
  Files: files(axios),
  User: user(axios),
}
