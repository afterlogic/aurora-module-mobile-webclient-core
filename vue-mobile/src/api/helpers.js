import types from 'src/utils/types'

export function getApiHost() {
  let apiHost = process.env.API
  if (!types.isNonEmptyString(apiHost)) {
    const appOrigin =
      window.location.origin ||
      window.location.protocol + '//' + window.location.host
    apiHost = appOrigin + window.location.pathname
  }
  if (
    types.isNonEmptyString(apiHost) &&
    apiHost.lastIndexOf('/') !== apiHost.length - 1
  ) {
    apiHost += '/'
  }
  return apiHost
}
