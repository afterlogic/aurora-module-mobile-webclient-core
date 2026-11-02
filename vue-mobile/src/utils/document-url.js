const CLIENT_ROUTE_ROOTS = ['mail', 'files', 'contacts', 'settings', 'mail-login', 'reset-password']

/**
 * Path of the Aurora install, without a Vue route that leaked into the real URL.
 * A document opened as /?/mobile-version keeps its pathname (including an install
 * directory that happens to be named "mail"). A document opened as /mail/1/INBOX
 * is the SPA route, so the install root is everything before that segment.
 */
export function installPathname (pathname, search) {
  const path = pathname || '/'
  const query = search || ''
  if (query.indexOf('mobile-version') !== -1) {
    return path
  }

  const segments = path.split('/')
  const routeIndex = segments.findIndex((segment, index) => {
    return index > 0 && CLIENT_ROUTE_ROOTS.indexOf(segment) !== -1
  })
  if (routeIndex === -1) {
    return path
  }

  const install = segments.slice(0, routeIndex).join('/')
  if (install === '') {
    return '/'
  }
  return install.charAt(install.length - 1) === '/' ? install : install + '/'
}

/**
 * Reload URL that stays on the current document and puts the Vue route in the hash.
 * Assigning the route path itself (/mail/...) asks the server for a file it does not have.
 */
export function chunkReloadUrl (locationLike, routeFullPath) {
  const pathname = (locationLike && locationLike.pathname) || '/'
  const search = (locationLike && locationLike.search) || ''
  let hash = routeFullPath || (locationLike && locationLike.hash) || '#/'
  if (hash.charAt(0) !== '#') {
    hash = '#' + (hash.charAt(0) === '/' ? hash : '/' + hash)
  }
  return pathname + search + hash
}
