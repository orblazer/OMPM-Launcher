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
      return new Promise((resolve) => {
        sioClient.emit('getModPacks', (modPacks) => {
          modPacks = Object.values(modPacks)

          if (modPacks.length > 0) {
            resolve([])
          }

          modPacks.forEach((modPack, key) => {
            if (modPack.logo === null) {
              modPack.logo = './assets/img/defaultMp.png'
            }

            store.commit('ADD_MODPACK', modPack)
            if ((key + 1) === modPacks.length) {
              resolve(store.state.modPacks)
            }
          })
        })
      })
    }
  }
})
