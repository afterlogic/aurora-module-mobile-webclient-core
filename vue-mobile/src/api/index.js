import axios from 'axios';

import files from './modules/files'

export default {
  Files: files(axios),
}
