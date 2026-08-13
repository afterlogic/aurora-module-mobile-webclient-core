const fse = require('fs-extra')
const path = require('path')

const removeDir = function (dirPath) {
  if (fse.existsSync(dirPath)) {
    const files = fse.readdirSync(dirPath)

    if (files.length > 0) {
      files.forEach(function (filename) {
        if (fse.statSync(dirPath + '/' + filename).isDirectory()) {
          removeDir(dirPath + '/' + filename)
        } else {
          fse.unlinkSync(dirPath + '/' + filename)
        }
      })
      fse.rmdirSync(dirPath)
    } else {
      fse.rmdirSync(dirPath)
    }
  } else {
    console.log('Directory path not found.')
  }
}

/**
 * Quasar emits absolute "/static/vue-mobile/..." URLs. When the SPA HTML is
 * served from ?mobile-version under a subdirectory install, those resolve
 * from the site root and 404. Strip the leading slash so paths stay relative
 * to the current document URL.
 */
function toRelativeStaticPaths (content) {
  return content
    .replace(/\/\.\/static\/vue-mobile\//g, 'static/vue-mobile/')
    .replace(/\/static\/vue-mobile\//g, 'static/vue-mobile/')
}

require('./prepare-files')

console.log('Start building the app...')
const execSync = require('child_process').execSync
const quasarBin = path.join(__dirname, '../node_modules/.bin/quasar')
const extraArgs = process.argv.slice(2).join(' ')
execSync(`"${quasarBin}" build ${extraArgs}`, { stdio: 'inherit', env: process.env })

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
  // Drop Quasar <base> tags: document URL is ?mobile-version (install root).
  indexContent = indexContent.replace(/<base\b[^>]*>/gi, '')
  indexContent = toRelativeStaticPaths(indexContent)
  // Favicons are emitted as root-relative "icons/..." — prefix for install subdir.
  indexContent = indexContent.replace(
    /\b(href=)(?!static\/)(icons\/|favicon\.ico)/g,
    '$1static/vue-mobile/$2'
  )
  fse.writeFileSync(destDir + 'index.html', indexContent)

  console.log('Rewriting absolute static paths in JS bundles...')
  const jsDir = destDir + 'js'
  if (fse.existsSync(jsDir)) {
    fse.readdirSync(jsDir).forEach((filename) => {
      if (!filename.endsWith('.js')) {
        return
      }
      const filePath = jsDir + '/' + filename
      const original = fse.readFileSync(filePath, 'utf8')
      const updated = toRelativeStaticPaths(original)
      if (updated !== original) {
        fse.writeFileSync(filePath, updated)
      }
    })
  }

  console.log('Everything is ready now')
} else {
  console.log('An error occurred while building the app')
}
