import _ from 'lodash'

import types from 'src/utils/types'

const enums = {
  UserRoles: {},

  init (appData) {
    const coreData = types.pObject(appData.Core, {})
    if (!_.isEmpty(coreData)) {
      this.UserRoles = types.pObject(coreData.EUserRole)
    }
  },
}

export default {
  init: enums.init.bind(enums),

  getUserRoles () {
    return enums.UserRoles
  },
}
