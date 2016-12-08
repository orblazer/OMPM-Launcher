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
    },

    RESET (state) {
      state.modPacks = []
    }
  },
  getters: {
    modPacks: state => state.modPacks
  },
  actions: {
    initialize (store) {
      return new Promise((resolve) => {
        sioClient.emit('getMyModPacks', (results) => {
          if (store.state.modPacks.length <= 0) {
            results.forEach((modPack, key) => {
              if (modPack.logo === null) {
                modPack.logo = '/assets/img/defaultMp.png'
              }

              store.commit('ADD_MODPACK', modPack)

              if ((key + 1) === results.length) {
                resolve(store.state.modPacks)
              }
            })
          } else {
            resolve(store.state.modPacks)
          }
        })
      })
    },

    reset (store) {
      store.commit('RESET')
    }
  }
})
