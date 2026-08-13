import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'

import core from 'src/core'
import modulesManager from 'src/modules-manager'

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

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
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

    const targetPath = (to && to.fullPath) || window.location.pathname + window.location.hash
    const reloadKey = 'chunkReloadPath'

    if (sessionStorage.getItem(reloadKey) === targetPath) {
      return
    }

    sessionStorage.setItem(reloadKey, targetPath)
    window.location.assign(targetPath)
  })

  Router.afterEach(() => {
    sessionStorage.removeItem('chunkReloadPath')
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
        next('/')
      }
    )
  })

  return Router
})
