import coreWebApi from 'src/api/core-web-api'
import { getApiHost } from 'src/api/helpers'

export function getDesktopUrl () {
  const host = getApiHost()
  if (host) {
    return host
  }

  return window.location.pathname || '/'
}

async function changeLayoutPreference (mobile) {
  try {
    await coreWebApi.setMobile(mobile)
  } catch {
    // The API already displayed the error. Keep the current page available for retry.
    return
  }
  window.location.assign(getDesktopUrl())
}

export function switchToDesktopVersion () {
  return changeLayoutPreference(false)
}

export function useAutomaticLayout () {
  return changeLayoutPreference('auto')
}
