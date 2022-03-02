import _ from 'lodash'

import types from 'src/utils/types'

import moduleList from 'src/modules'
import store from 'src/store'

let availableClientModules = []
let availableBackendModules = []
let availableModules = []

const modulesOrder = ['mail', 'contacts', 'files', 'settings']

let allModules = null
let allModulesNames = []
let normalUserPages = null
let anonymousPages = null
let currentPageName = null
let normalUserFooterButtons = null

function _checkIfModuleAvailable(module, modules, depth = 1) {
  if (depth > 4) {
    return true // to prevent infinite recursion if some modules require each other for some reason
  }
  const isAvailable = availableModules.indexOf(module.moduleName) !== -1
  const isEveryRequireAvailable = _.isArray(module.requiredModules)
    ? module.requiredModules.every((requiredModuleName) => {
        const requiredModule = modules.find((module) => {
          return module.moduleName === requiredModuleName
        })
        return requiredModule
          ? _checkIfModuleAvailable(requiredModule, modules, depth + 1)
          : availableModules.indexOf(requiredModuleName) !== -1
      })
    : true
  return isAvailable && isEveryRequireAvailable
}

export default {
  async getModules (appData) {
    if (allModules === null) {
      availableClientModules = types.pArray(appData?.Core?.AvailableClientModules)
      availableBackendModules = types.pArray(appData?.Core?.AvailableBackendModules)
      availableModules = _.uniq(availableClientModules.concat(availableBackendModules))
      let modules = await moduleList.getModules()
      if (_.isArray(modules)) {
        modules = modules.map(module => {
          return _.isObject(module.default) ? module.default : null
        })
        allModules = modules.filter(module => {
          if (_.isObject(module)) {
            return _checkIfModuleAvailable(module, modules)
          }
          return false
        })
        allModulesNames = allModules.map(module => {
          return module.moduleName
        })
      } else {
        allModules = []
        allModulesNames = []
      }
      if (allModules.length === 0) {
        throw new Error('There are no available modules')
      }
      if (allModulesNames.indexOf('CoreMobileWebclient') === -1) {
        throw new Error('CoreMobileWebclient module is not available')
      }
    }
  },

  initModules (appData) {
    _.each(allModules, oModule => {
      if (_.isFunction(oModule.initSubscriptions)) {
        oModule.initSubscriptions(appData)
      }
    })
    _.each(allModules, oModule => {
      if (_.isFunction(oModule.init)) {
        oModule.init(appData)
      }
    })
  },

  isModuleAvailable (moduleName) {
    return allModulesNames.indexOf(moduleName) !== -1 || availableBackendModules.indexOf(moduleName) !== -1
  },

  setCurrentPageName (pageName) {
    currentPageName = pageName
  },

  getAllPages () {
    return this.getAnonymousPages().concat(this.getNormalUserPages())
  },

  getDefaultPageForUser () {
    const isUserNormalOrTenant = store.getters['core/isUserNormalOrTenant']
    let page = null
    if (isUserNormalOrTenant) {
      page = normalUserPages.find(page => page.pageName === modulesOrder[0]) || null
    } else {
      page = anonymousPages[0]
    }
    return page
  },

  /**
   * Path is corrected depending on which page is allowed for user (if someone is authenticated) or anonymous (if no one is authenticated)
   * @param matchedRoutes
   * @param toPath
   * @returns {string}
   */
  correctPathForUser (matchedRoutes, toPath = null) {
    if (!_.isArray(anonymousPages) || anonymousPages.length === 0 || !_.isArray(normalUserPages) || normalUserPages.length === 0) {
      this.setCurrentPageName('')
      return toPath || '/'
    }

    const matchedRouteName = _.isArray(matchedRoutes) && matchedRoutes.length > 0 ? matchedRoutes[0].name : null
    const isUserNormalOrTenant = store.getters['core/isUserNormalOrTenant']
    let page = null
    if (matchedRouteName !== null) {
      if (isUserNormalOrTenant) {
        page = normalUserPages.find(page => page.pageName === matchedRouteName) || null
      } else {
        page = anonymousPages.find(page => page.pageName === matchedRouteName) || null
      }
    }
    if (page === null) {
      page = this.getDefaultPageForUser()
    }
    if (page === null) {
      this.setCurrentPageName('')
      return '/'
    } else if (page.pageName === matchedRouteName) {
      this.setCurrentPageName(page.pageName)
      return toPath || page.pagePath
    } else {
      this.setCurrentPageName(page.pageName)
      return page.pagePath
    }
  },

  getAnonymousPages () {
    if (anonymousPages === null && allModules !== null) {
      anonymousPages = []
      allModules.forEach(module => {
        const modulePages = _.isFunction(module.getAnonymousPages) && module.getAnonymousPages()
        if (_.isArray(modulePages)) {
          anonymousPages = anonymousPages.concat(modulePages)
        }
      })
    }
    return anonymousPages === null ? [] : anonymousPages
  },

  getNormalUserPages () {
    if (normalUserPages === null && allModules !== null) {
      normalUserPages = []
      allModules.forEach(module => {
        const modulePages = _.isFunction(module.getNormalUserPages) && module.getNormalUserPages()
        if (_.isArray(modulePages)) {
          normalUserPages = normalUserPages.concat(modulePages)
        }
      })
    }
    return normalUserPages === null ? [] : normalUserPages
  },

  async getPageHeaderComponent () {
    const normalUserPages = this.getNormalUserPages()
    const currentPageData = normalUserPages.find(pageData => pageData.pageName === currentPageName)
    if (_.isFunction(currentPageData?.pageHeaderComponent)) {
      const component = await currentPageData.pageHeaderComponent()
      if (component?.default) {
        return component.default
      }
    }
    return null
  },

  async getPageFooterComponent () {
    const normalUserPages = this.getNormalUserPages()
    const currentPageData = normalUserPages.find(pageData => pageData.pageName === currentPageName)
    if (_.isFunction(currentPageData?.pageFooterComponent)) {
      const component = await currentPageData.pageFooterComponent()
      if (component?.default) {
        return component.default
      }
    }
    return null
  },

  async getPageFooterButtons () {
    if (normalUserFooterButtons === null && allModules !== null) {
      normalUserFooterButtons = []
      allModules.forEach(module => {
        const moduleFooterButtons = _.isFunction(module.getPageFooterButtons) && module.getPageFooterButtons()
        if (_.isArray(moduleFooterButtons)) {
          normalUserFooterButtons = normalUserFooterButtons.concat(moduleFooterButtons)
        }
      })
    }

    normalUserFooterButtons.sort(function(a, b) {
      const aPos = modulesOrder.indexOf(a.pageName)
      const bPos = modulesOrder.indexOf(b.pageName)
      return aPos - bPos
    })

    return normalUserFooterButtons === null ? [] : normalUserFooterButtons
  },
}
