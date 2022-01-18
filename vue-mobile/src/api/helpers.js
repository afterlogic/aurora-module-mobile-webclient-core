import _ from 'lodash'

import typesUtils from 'src/utils/types'

export function getApiHost() {
  // let apiHost = process.env.API
  let apiHost = 'https://aurora.afterlogic.com/'
  if (
    typesUtils.isNonEmptyString(apiHost) &&
    apiHost.lastIndexOf('/') !== apiHost.length - 1
  ) {
    apiHost += '/'
  }
  return apiHost
}
