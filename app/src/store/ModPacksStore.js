/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 18/10/2016
 */
import Vuex from 'vuex'

export default new Vuex.Store({
  strict: true,
  state: {
    modPacks: []
  },
  mutations: {
    ADD_MODPACK (state, modPack) {
      state.modPacks.push(modPack)
    }
  },
  getters: {
    modPacks: state => state.modPacks
  },
  actions: {
    initialize (store) {
      return new Promise((resolve, reject) => {
        sioClient.emit('getModPacks', (results) => {
          if (store.state.modPacks.length <= 0) {
            results[0].forEach((modPack, key) => {
              modPack.authors = JSON.parse(modPack.authors)
              if (modPack.logo === null) {
                modPack.logo = '/assets/img/defaultMp.png'
              }

              modPack.coreMods = []
              modPack.mods = []
              modPack.optionalMods = []

              sioClient.emit('getModPackVersions', modPack.uid, (results2) => {
                modPack.availableVersions = results2[0]

                sioClient.emit('getMPMods', modPack.lastVersionUid, (results3) => {
                  if (results3[0].length > 0) {
                    results3[0].forEach((mod, key1) => {
                      let modType = 'mods'
                      if (mod.type === 'core') {
                        modType = 'coreMods'
                      } else if (mod.type === 'optional') {
                        modType = 'optionalMods'
                      }
                      delete mod.type

                      mod.authors = JSON.parse(mod.authors)

                      modPack[modType].push(mod)

                      if ((key1 + 1) === results3[0].length) {
                        store.commit('ADD_MODPACK', modPack)

                        if ((key + 1) === results[0].length) {
                          resolve(store.state.modPacks)
                        }
                      }
                    })
                  } else {
                    store.commit('ADD_MODPACK', modPack)

                    if ((key + 1) === results[0].length) {
                      resolve(store.state.modPacks)
                    }
                  }
                })
              })
            })
          } else {
            resolve(store.state.modPacks)
          }
        })
      })
    }
  }
})
