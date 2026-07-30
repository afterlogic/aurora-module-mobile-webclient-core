const { spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const vueMobileRoot = path.join(__dirname, '../../..')
const defaultHtmlReport = path.join(vueMobileRoot, 'playwright-report', 'index.html')

/**
 * If the report is already HTML, return it as-is.
 * Otherwise wrap plain text in a minimal HTML page for viewing in a browser.
 *
 * @param {string} reportPath
 * @returns {string} path to an HTML file
 */
function ensureHtmlReport(reportPath) {
  if (!reportPath || !fs.existsSync(reportPath)) {
    throw new Error(`E2E report file not found: ${reportPath || '(empty path)'}`)
  }

  const ext = path.extname(reportPath).toLowerCase()
  if (ext === '.html' || ext === '.htm') {
    return reportPath
  }

  const raw = fs.readFileSync(reportPath, 'utf8')
  const escaped = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  const htmlPath = `${reportPath}.html`
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>E2E report</title>
  <style>
    body { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; margin: 24px; background: #111; color: #eee; }
    pre { white-space: pre-wrap; word-break: break-word; line-height: 1.4; }
  </style>
</head>
<body>
  <h1>E2E report</h1>
  <pre>${escaped}</pre>
</body>
</html>
`
  fs.writeFileSync(htmlPath, html, 'utf8')
  return htmlPath
}

/**
 * Stub: later will send the HTML report by email.
 * @param {string} reportHtmlPath
 */
function sendTestReportEmail(reportHtmlPath) {
  console.log(
    `[e2e-notify] stub: would send email with report file: ${reportHtmlPath}`
  )
}

function runPlaywright(extraArgs) {
  const auroraRoot = path.join(vueMobileRoot, '..', '..', '..')
  const nodeModules = path.join(auroraRoot, 'node_modules')
  const playwrightBin = path.join(
    nodeModules,
    '.bin',
    process.platform === 'win32' ? 'playwright.cmd' : 'playwright'
  )

  if (!fs.existsSync(playwrightBin)) {
    throw new Error(
      `Playwright not found at ${path.join(nodeModules, '@playwright/test')}. ` +
        'From Aurora install root run: npm install'
    )
  }

  const env = { ...process.env }
  env.NODE_PATH = env.NODE_PATH
    ? `${nodeModules}${path.delimiter}${env.NODE_PATH}`
    : nodeModules

  const result = spawnSync(playwrightBin, ['test', ...extraArgs], {
    cwd: vueMobileRoot,
    stdio: 'inherit',
    env,
  })

  if (result.error) {
    throw result.error
  }

  return result.status === null ? 1 : result.status
}

function main() {
  const extraArgs = process.argv.slice(2)
  const exitCode = runPlaywright(extraArgs)

  try {
    const reportPath =
      process.env.E2E_REPORT_PATH || defaultHtmlReport
    const htmlPath = ensureHtmlReport(reportPath)
    sendTestReportEmail(htmlPath)
  } catch (err) {
    console.warn(`[e2e-notify] skipped email stub: ${err.message}`)
  }

  process.exit(exitCode)
}

main()
