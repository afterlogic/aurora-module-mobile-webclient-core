import coreWebApi from 'src/api/core-web-api'
import { getApiHost } from 'src/api/helpers'

export function getDesktopUrl () {
  const host = getApiHost()
  if (host) {
    return host.replace(/\/$/, '')
  }

  return window.location.pathname.replace(/\/$/, '') || '/'
}

export async function switchToDesktopVersion () {
  try {
    await coreWebApi.setMobile(false)
  } finally {
    window.location.assign(getDesktopUrl())
  }
}
