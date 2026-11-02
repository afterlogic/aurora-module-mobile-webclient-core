import types from 'src/utils/types'
import { installPathname } from 'src/utils/document-url'

export function getApiHost() {
  let apiHost = process.env.API
  if (!types.isNonEmptyString(apiHost)) {
    const appOrigin =
      window.location.origin ||
      window.location.protocol + '//' + window.location.host
    const pathname = window.location.pathname || '/'

    // The SPA may be opened from /static/vue-mobile/, but API always lives at the app root.
    if (pathname.includes('/static/vue-mobile')) {
      apiHost = appOrigin + '/'
    } else {
      apiHost = appOrigin + installPathname(pathname, window.location.search)
    }
  }
  if (
    types.isNonEmptyString(apiHost) &&
    apiHost.lastIndexOf('/') !== apiHost.length - 1
  ) {
    apiHost += '/'
  }
  return apiHost
}
