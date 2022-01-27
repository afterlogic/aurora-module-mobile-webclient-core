import _ from 'lodash'

import typesUtils from 'src/utils/types'

import moduleList from 'src/modules'

let availableClientModules = []
let availableBackendModules = []
let availableModules = []

let allModules = null
let allModulesNames = []
let pages = null

let systemTabs = null

let tenantTabs = null
let tenantEditDataComponent = null

let userTabs = null
let userMainDataComponent = null
let userOtherDataComponents = null
let userFilters = null

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
      availableClientModules = typesUtils.pArray(appData?.Core?.AvailableClientModules)
      availableBackendModules = typesUtils.pArray(appData?.Core?.AvailableBackendModules)
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

  getPages () {
    if (pages === null && allModules !== null) {
      pages = []
      _.each(allModules, oModule => {
        const aPages = _.isFunction(oModule.getPages) && oModule.getPages()
        if (_.isArray(aPages)) {
          pages = pages.concat(aPages)
        }
      })
    }
    return pages === null ? [] : pages
  },
}
