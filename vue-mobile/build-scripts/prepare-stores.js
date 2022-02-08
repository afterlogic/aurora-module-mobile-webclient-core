const fs = require('fs')

function prepareStores() {
  const modulesPath = './src/../../../'
  const storesPaths = []
  const storesNames = []
  fs.readdirSync(modulesPath).forEach((moduleName) => {
    let moduleStorePath = modulesPath + moduleName + '/vue-mobile/store'
    if (fs.existsSync(moduleStorePath)) {
      moduleStorePath = moduleStorePath.slice(2)
      const moduleStoreName = moduleName.toLowerCase().replace('webclient', '')
      storesNames.push(`    ${moduleStoreName},`)
      storesPaths.push(`import ${moduleStoreName} from '${moduleStorePath}'`)
    }
  })

  const dir = './src/store'
  if (fs.existsSync(dir)) {
    const paths = storesPaths.join('\n')
    const names = storesNames.join('\n')
    const storesContent = `import Vuex from 'vuex'

import core from './core'
${paths}

export default new Vuex.Store({
  modules: {
    core,
${names}
  },

  strict: process.env.DEBUGGING
})
`
    fs.writeFileSync(dir + '/index.js', storesContent)
  }
}

prepareStores()
