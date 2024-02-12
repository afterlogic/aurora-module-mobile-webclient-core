const fs = require('fs')

function extractStoreNames(moduleStorePath) {
  let result = []

  if (fs.existsSync(moduleStorePath)) {
    const fileContent = fs.readFileSync(moduleStorePath, 'utf8')
    if (fileContent) {
      const matches = [...fileContent.matchAll(/export\s+const\s+(\w+)\s*=\s*defineStore/gmi)]
      matches.forEach((group) => {
        if (group[1]) {
          result.push(group[1])
        }
      })
    }
  }
  
  return result
}

function prepareStores() {
  const modulesPath = './src/../../../'
  const storesPaths = []
  const storesNames = []
  fs.readdirSync(modulesPath).forEach((moduleName) => {
    let moduleStorePath = modulesPath + moduleName + '/vue-mobile/store'
    if (fs.existsSync(moduleStorePath)) {
      moduleStorePath = moduleStorePath.slice(2)
      
      const moduleStoreNames = extractStoreNames(moduleStorePath + '/index-pinia.js')
      moduleStoreNames.forEach((moduleStoreName) => {
        storesNames.push(`  ${moduleStoreName},`)
        storesPaths.push(`import { ${moduleStoreName} } from '${moduleStorePath}/index-pinia.js'`)
      })
    }
  })

  const dir = './src/stores'

  if (fs.existsSync(dir)) {
    const paths = storesPaths.join('\n')
    const names = storesNames.join('\n')
    const storesContent =
`import { useCoreStore } from './index-pinia'
${paths}

export {
  useCoreStore,  
${names}
}`
    fs.writeFileSync(dir + '/index-all.js', storesContent)
  }
}

prepareStores()
