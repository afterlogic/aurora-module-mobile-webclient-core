import { route } from 'quasar/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'

import routes from './routes'

import core from 'src/core'
import store from 'src/store'
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
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory

  const router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  })

  let routesAdded = false
  router.beforeEach((to, from, next) => {
    core.init().then(
      async () => {
        if (!routesAdded) {
          modulesManager.getAllPages().forEach(page => {
            const routeData = { name: page.pageName, path: page.pagePath, component: page.pageComponent }
            if (page.pageChildren) {
              routeData.children = page.pageChildren
            }
            router.addRoute(page.pageName, routeData)
          })
          routesAdded = true
          next(to.path)
          return
        }
        if (!_.isArray(to.matched) || to.matched.length === 0) {
          if (store.getters['user/isUserNormalOrTenant']) {
            if (to.path !== '/mail') {
              next('/mail')
              return
            }
          } else {
            if (to.path !== '/') {
              next('/')
              return
            }
          }
          modulesManager.setCurrentPageName('')
        } else {
          modulesManager.setCurrentPageName(to.matched[0].name)
        }
        next()
      },
      (error) => {
        console.error('core.init reject', error)
      }
    )
  })
  return router
})
