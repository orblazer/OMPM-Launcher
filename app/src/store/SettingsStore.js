/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 20/10/2016
 */
import Vuex from 'vuex'
import path from 'path'
import fs from 'fs'
import LauncherLog from '../lib/log/LauncherLog'

const configFile = path.join('app', 'config', 'config.json')

function saveConfig (config) {
  return new Promise((resolve, reject) => {
    fs.writeFile(configFile, JSON.stringify(config), (err) => {
      if (err) {
        LauncherLog.error(err)
        reject()
      } else {
        LauncherLog.log('Settings is saved')
        resolve(config)
      }
    })
  })
}
function readConfig (store) {
  return new Promise((resolve, reject) => {
    fs.open(configFile, 'r', (err, fd) => {
      if (err) {
        if (err.code === 'ENOENT') {
          reject()
          return
        } else {
          reject()
          LauncherLog.error(err)
          throw err
        }
      }

      const config = JSON.parse(fs.readFileSync(configFile))
      store.commit('INITIALIZE', config)
      resolve(config)
      fs.closeSync(fd)
    })
  })
}

export default new Vuex.Store({
  strict: true,
  state: {
    general: {
      installPath: process.cwd(),
      launcherVisibility: 'always'
    },
    java: {
      installPath: path.normalize(path.join(process.env.JAVA_HOME, './bin/java.exe')),
      allocatedRam: 1024
    }
  },
  mutations: {
    INITIALIZE (state, config) {
      LauncherLog.log('Settings is loaded')
      state = config
    }
  },
  getters: {
    settings: state => state
  },
  actions: {
    initialize (store) {
      LauncherLog.debug('Loading settings...')
      return new Promise((resolve, reject) => {
        readConfig(store).then(resolve).catch(() => {
          saveConfig(store.getters.settings).then(resolve).catch(reject)
        })
      })
    },

    saveConfig (store, config) {
      return saveConfig(config)
    }
  }
})
