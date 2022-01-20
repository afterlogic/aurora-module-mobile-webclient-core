const fse = require('fs-extra')

const removeDir = function (path) {
  if (fse.existsSync(path)) {
    const files = fse.readdirSync(path)

    if (files.length > 0) {
      files.forEach(function (filename) {
        if (fse.statSync(path + '/' + filename).isDirectory()) {
          removeDir(path + '/' + filename)
        } else {
          fse.unlinkSync(path + '/' + filename)
        }
      })
      fse.rmdirSync(path)
    } else {
      fse.rmdirSync(path)
    }
  } else {
    console.log('Directory path not found.')
  }
}

require('./prepare-files')

console.log('Start building the app...')
const execSync = require('child_process').execSync
execSync('quasar build')

const srcDir = './dist/spa'
if (fse.existsSync(srcDir)) {
  console.log('The app is built successfully')

  const destDir = '../../../static/vue-mobile/'
  if (fse.existsSync(destDir)) {
    removeDir(destDir)
  }

  console.log('Start moving app files to the static/vue-mobile directory...')
  fse.moveSync(srcDir, destDir)
  console.log('The app is now in the static/vue-mobile directory')

  console.log('Start to prepare index.html...')
  let indexContent = fse.readFileSync(destDir + 'index.html', 'utf8')
  indexContent = indexContent.replaceAll(
    '<head><title>',
    '<head><base href=static/vue-mobile/ ><title>'
  )
  fse.writeFileSync(destDir + 'index.html', indexContent)

  console.log('Everything is ready now')
} else {
  console.log('An error occurred while building the app')
}
