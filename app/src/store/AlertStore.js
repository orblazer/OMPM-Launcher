/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 17/10/2016
 */
import Vuex from 'vuex'

export default new Vuex.Store({
  strict: true,
  state: {
    alerts: []
  },
  mutations: {
    ALERT (state, data) {
      if ((typeof data !== 'object') && data.id && data.type && data.message && data.timeout) {
        return
      }

      state.alerts.push(data)
    },
    REMOVE (state, id) {
      state.alerts.forEach((alert, index) => {
        if (alert.id === id) {
          if (typeof alert.removeTask === 'number') {
            clearTimeout(alert.removeTask)
          }
          Vue.delete(state.alerts, index)
        }
      })
    }
  },
  getters: {
    alerts: state => state.alerts
  },
  actions: {
    alert (store, data) {
      if ((typeof data !== 'object') && (data.message !== '')) {
        return
      }

      if ((data.id == null) || (data.id === '')) {
        data.id = 'alert-' + store.state.alerts.length
      }
      if ((data.type == null) || (data.type === '')) {
        data.type = 'success'
      }
      if ((typeof data.timeout !== 'number') || (data.timeout < 0)) {
        data.timeout = 3000
      }

      if (data.timeout && data.timeout > 0) {
        data.removeTask = setTimeout(() => {
          store.commit('REMOVE', data.id)
        }, data.timeout)
      }

      // Commit alert
      store.commit('ALERT', data)
    },
    remove (store, id) {
      store.commit('REMOVE', id)
    }
  }
})
