import Electron, { BrowserWindow } from 'electron'
import Path from 'path'
import IPFS from 'ipfs'
import * as Protocol from './protocol'
import OS from 'os'

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    titleBarStyle: 'hiddenInset',
    ...getWindowSizeAndPosition(),
    webPreferences: {
      preload: Path.join(__dirname, 'preload.js'),
      webviewTag: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('lib/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

function getWindowSizeAndPosition () {
  const { bounds } = Electron.screen.getPrimaryDisplay()
  const width = Math.max(800, Math.min(1800, bounds.width - 200))
  const height = Math.max(600, Math.min(1200, bounds.height - 100))
  return {
    x: (bounds.width - width) / 2,
    y: (bounds.height - height) / 2,
    width,
    height,
    minWidth: 400,
    minHeight: 300
  }
}

Electron.app.allowRendererProcessReuse = true

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
Electron.app.whenReady().then(onReady)

// Quit when all windows are closed.
Electron.app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') Electron.app.quit()
})

Electron.app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

Electron.protocol.registerSchemesAsPrivileged([{
  scheme: 'ipfs',
  privileges: {
    standard: true,
    secure: true,
    allowServiceWorkers: true,
    supportFetchAPI: true,
    corsEnabled: true
  }
}])

async function onReady () {
  // TODO: add delegates
  const ipfs = await IPFS.create({
    repo: Path.join(OS.homedir(), '.planetary'),
    config: {
      Addresses: {
        Swarm: [
          '/ip4/0.0.0.0/tcp/0',
          '/ip4/0.0.0.0/tcp/0/ws'
        ]
      }
    }
  })
  const protocol = await Protocol.create({ ipfs })

  Electron.protocol.registerStreamProtocol('ipfs', protocol.handler)

  createWindow()
}
