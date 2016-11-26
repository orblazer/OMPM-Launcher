/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 20/10/2016
 */
import Vuex from 'vuex'
import path from 'path'
import fs from 'fs'

const configFolder = path.join('../', '../', 'config') // TODO 20/10/2016 Temporary ?
const instancesFile = path.join(configFolder, 'instances.json')

export default new Vuex.Store({
  strict: true,
  state: {
    instances: {}
  },
  mutations: {
    INITIALIZE (state, instance) {
      Vue.set(state.instances, instance.uid, instance)
    },
    ADD_INSTANCE (state, instance) {
      state.instances.push({
        uid: Math.random().toString(36).substr(2),
        name: instance.name,
        versions: instance.versions,
        mpVersionUid: instance.mpVersionUid
      })

      fs.writeFileSync(instancesFile, JSON.stringify(state.instances))
    }
  },
  getters: {
    instances: state => state.instances
  },
  actions: {
    initialize (store) {
      return new Promise((resolve, reject) => {
        fs.open(instancesFile, 'r', (err, fd) => {
          if (err) {
            if (err.code === 'ENOENT') {
              resolve(null)
              return
            } else {
              reject(err)
              throw err
            }
          }

          const instance = JSON.parse(fs.readFileSync(instancesFile))
          store.commit('INITIALIZE', instance)
          resolve(instance)
          fs.closeSync(fd)
        })
      })
    },

    addInstance (store, instance) {
      store.commit('ADD_INSTANCE', instance)
    }
  }
})
