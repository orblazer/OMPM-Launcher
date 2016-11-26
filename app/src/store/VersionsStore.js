/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 28/10/2016
 */
import Vuex from 'vuex'

export default new Vuex.Store({
  strict: 'true',
  state: {
    forgeVersions: [],
    mcVersions: []
  },
  mutations: {
    /**
     * Set the forge versions
     * @param {Object} state The state
     * @param {Object} forgeVersions The forge versions
     * @constructor
     */
    SET_FORGEVERSIONS (state, forgeVersions) {
      state.forgeVersions = forgeVersions
    },

    /**
     * Set the minecraft versions
     * @param {Object} state The state
     * @param {Object} mcVersions The minecraft versions
     * @constructor
     */
    SET_MCVERSIONS (state, mcVersions) {
      state.mcVersions = mcVersions
    }
  },
  getters: {
    forgeVersions: state => state.forgeVersions,
    mcVersions: state => state.mcVersions
  },
  actions: {
    /**
     * Initialize the versions
     * @param {Object} store The store
     * @return {Promise} The promise of initializing
     */
    initialize (store) {
      return new Promise((resolve, reject) => {
        sioClient.emit('getAllForgeVersions', (results) => {
          if (store.state.forgeVersions.length <= 0) {
            store.commit('SET_FORGEVERSIONS', results[0])

            sioClient.emit('getMcVersions', (results2) => {
              store.commit('SET_MCVERSIONS', results2[0])

              resolve()
            })
          } else {
            resolve()
          }
        })
      })
    }
  }
})
