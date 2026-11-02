import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'

import core from 'src/core'
import modulesManager from 'src/modules-manager'
import { chunkReloadUrl } from 'src/utils/document-url'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Hash mode must follow the document URL (?/mobile-version, or a subdirectory
    // install). A fixed base of "/" drops that query when a <base> tag is present
    // and the next reload is no longer the mobile entry.
    // History mode still uses quasar.conf.js -> build -> vueRouterBase.
    history: createHistory(
      process.env.MODE === 'ssr' || process.env.VUE_ROUTER_MODE !== 'history'
        ? undefined
        : process.env.VUE_ROUTER_BASE
    )
  })

  // Reload once when a stale bundle fails to load a lazy chunk after deploy.
  const isChunkLoadError = (error) => {
    const message = (error && (error.message || error.toString())) || ''
    return /Loading (CSS )?chunk [^ ]+ failed/i.test(message) ||
      /ChunkLoadError/i.test(message) ||
      /Loading dynamically imported module/i.test(message) ||
      /Failed to fetch dynamically imported module/i.test(message) ||
      /error loading dynamically imported module/i.test(message)
  }

  Router.onError((error, to) => {
    if (!isChunkLoadError(error)) {
      return
    }

    // fullPath is the Vue route (/mail/...), not a document on the server.
    const targetUrl = chunkReloadUrl(window.location, to && to.fullPath)
    const reloadKey = 'chunkReloadUrl'

    if (sessionStorage.getItem(reloadKey) === targetUrl) {
      return
    }

    sessionStorage.setItem(reloadKey, targetUrl)
    window.location.replace(targetUrl)
  })

  Router.afterEach(() => {
    sessionStorage.removeItem('chunkReloadUrl')
  })

  let routesAdded = false
  Router.beforeEach((to, from, next) => {
    core.init().then(
      async () => {
        if (!routesAdded) {
          const pages = modulesManager.getAllPages()
          pages.forEach(page => {
            const routeData = { name: page.pageName, path: page.pagePath, component: page.pageComponent, strict: page.pageStrict }
            if (page.pageChildren) {
              routeData.children = page.pageChildren
            }
            Router.addRoute(page.pageName, routeData)
          })
          routesAdded = true
          next(to.path)
          return
        }

        const correctedPath = modulesManager.correctPathForUser(to.matched, to.path)
        if (to.path !== correctedPath) {
          next(correctedPath)
          return
        }
        next()
      },
      (error) => {
        // Every redirect starts core.init() again. Don't go round in circles (and don't flood
        // the server with requests) when the application data can't be loaded.
        if (core.hasTooManyGetAppDataFailures()) {
          next(false)
          return
        }
        next('/')
      }
    )
  })

  return Router
})
