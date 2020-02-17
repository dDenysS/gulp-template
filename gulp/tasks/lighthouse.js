const path = require('path')
const fs = require('fs').promises
const open = require('open')
const server = require('browser-sync').create()
const del = require('del')
const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')
const { write } = require('lighthouse/lighthouse-cli/printer')
const reportGenerator = require('lighthouse/lighthouse-core/report/report-generator')

const config = require('../config')

async function getNameHTMLFiles() {
  const files = await fs.readdir(config.buildPath)

  return files.filter(item => item.endsWith('.html'))
}

function startServer() {
  return server.init({
    server: config.buildPath,
    port: config.lighthouse.PORT,
    notify: false,
    open: false,
    cors: true
  })
}

async function launchChromeAndRunLighthouse(url) {
  const chrome = await chromeLauncher.launch()
  config.lighthouse.chromeLauncherPort = chrome.port

  const result = await lighthouse(url, {
    ...config.lighthouse.flags,
    port: config.lighthouse.chromeLauncherPort
  }, config.lighthouse.config)
  await chrome.kill()

  return result
}

async function runLighthouse(fileName) {
  console.log(fileName)
  const result = await launchChromeAndRunLighthouse(`http://localhost:${config.lighthouse.PORT}/${fileName}`)

  await write(reportGenerator.generateReportHtml(result.lhr), 'html', path.join(config.lighthouse.reportPath, fileName))
}

module.exports = async function lighthouse(cb) {
  await del(config.lighthouse.reportPath)
  await fs.mkdir(config.lighthouse.reportPath)

  startServer()
  const files = await getNameHTMLFiles()

  try {
    for (const file of files) {
      await runLighthouse(file)
    }

    for (const file of files) {
      await open(path.join(config.lighthouse.reportPath, file))
    }
    cb()
    process.exit(0) //browser-sync API server.exit() do not work
  } catch (e) {
    cb(e.message)
    process.exit(1) //browser-sync API server.exit() do not work
  }
}
