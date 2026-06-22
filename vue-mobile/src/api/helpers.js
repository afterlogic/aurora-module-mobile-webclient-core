import types from 'src/utils/types'

export function getApiHost() {
  let apiHost = process.env.API
  if (!types.isNonEmptyString(apiHost)) {
    const appOrigin =
      window.location.origin ||
      window.location.protocol + '//' + window.location.host
    // API is always at site root (?/Api/), even when static assets use /static/vue-mobile/
    apiHost = appOrigin + '/'
  }
  if (
    types.isNonEmptyString(apiHost) &&
    apiHost.lastIndexOf('/') !== apiHost.length - 1
  ) {
    apiHost += '/'
  }
  return apiHost
}
