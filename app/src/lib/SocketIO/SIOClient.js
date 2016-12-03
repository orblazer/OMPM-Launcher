/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 29/10/2016
 */
import ioClient from 'socket.io-client'
import Alert from '../../store/AlertStore'
import LauncherLog from '../../lib/log/LauncherLog'

const _sio = Symbol('sio')
class SIOClient {
  /**
   * Construct Socket.IO Client
   * @param {function|undefined} connected The callback of connected
   * @param {function|undefined} cantConnect The callback of can't connect
   */
  constructor (connected = undefined, cantConnect = undefined) {
    this[_sio] = ioClient('http://localhost:8080', { multiplex: false })
    let tryReconnect = false

    this[_sio].on('connect', () => {
      global.sioClient = this
      App.serverAvailable = true

      if (tryReconnect) {
        Alert.dispatch('remove', 'alert-tryReconnect')
        Alert.dispatch('alert', {
          message: Vue.t('server.connected')
        })

        LauncherLog.log('Successful reconnect to server, use online launcher')
      }

      if (typeof connected === 'function') {
        connected(this)
      }
    })
    this[_sio].on('disconnect', (reason) => {
      App.serverAvailable = false
      LauncherLog.error('Connection lost, use local launcher')

      if (reason === 'transport close') {
        tryReconnect = true

        Alert.dispatch('alert', {
          id: 'alert-tryReconnect',
          timeout: 0,
          type: 'error',
          message: Vue.t('server.connectionLost')
        })
      } else {
        console.warn('Disconnect for reason :', reason)
      }
    })

    this[_sio].on('connect_error', (err) => {
      if (err.message === 'xhr poll error') {
        tryReconnect = true
      }

      if (typeof cantConnect === 'function') {
        cantConnect(err)
      }
    })
    this[_sio].on('connect_timeout', (err) => {
      throw err
    })
  }

  /**
   * Emit message to Socket.IO
   * @param {string} channel The channel of message
   * @param {object|function} data The data or callback of function
   * @param {function|undefined} callback The callback of message
   */
  emit (channel, data = null, callback = undefined) {
    if (typeof data === 'function') {
      callback = data
      data = null
    }

    this[_sio].emit(channel, data, callback)
  }

  /**
   * Receive message from Socket.IO
   * @param {string} channel The channel of message
   * @param {function} callback The callback of message
   */
  on (channel, callback) {
    this[_sio].on(channel, callback)
  }
}
export default SIOClient
