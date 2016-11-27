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

/**
 * Save the config
 * @param {Object} config The config
 * @return {Promise} The promise of save config
 */
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
/**
 * Read the config
 * @param {Object} store The store
 * @return {Promise} The promise of read config
 */
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
      launcherVisibility: 'always',
      lang: Vue.config.lang
    },
    java: {
      installPath: process.env.JAVA_HOME,
      allocatedRam: 1024
    }
  },
  mutations: {
    /**
     * Set the settings
     * @param {Object} state The state
     * @param {Object} config The settings
     * @constructor
     */
    INITIALIZE (state, config) {
      LauncherLog.log('Settings is loaded')

      Vue.set(state, 'general', config.general)
      Vue.set(state, 'java', config.java)
    }
  },
  getters: {
    settings: state => state
  },
  actions: {
    /**
     * Initialize the config
     * @param {Object} store Tee store
     * @return {Promise} The promise of initializing
     */
    initialize (store) {
      LauncherLog.debug('Loading settings...')
      return new Promise((resolve, reject) => {
        readConfig(store).then(resolve).catch(() => {
          saveConfig(store.getters.settings).then(resolve).catch(reject)
        })
      })
    },

    /**
     * Save the config
     * @param {Object} store The store
     * @param {Object} config The config
     * @return {Promise} The promise of save config
     */
    saveConfig (store, config) {
      return saveConfig(config)
    }
  }
})
