/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 29/10/2016
 */
import ioClient from 'socket.io-client'

const _sio = Symbol('sio')
class SIOClient {
  constructor (connected, cantConnect) {
    this[_sio] = ioClient('http://localhost:8080', { multiplex: false })

    this[_sio].on('connect', () => {
      global.sioClient = this

      // TODO 26/11/2016 This is just for test !
      console.info('AUTO LOGIN !')
      this.emit('login', '2df03368a4c64b058807fca12ab50134')

      this.emit('canAccessMPEditor', (canAccess) => {
        App.canAccessMPEditor = canAccess
      })
      this.emit('canAccessAdmin', (canAccess) => {
        App.canAccessAdmin = canAccess
      })

      if (typeof connected === 'function') {
        connected(this)
      }
    })
    this[_sio].on('connect_error', cantConnect)
    this[_sio].on('connect_timeout', cantConnect)
  }

  get SocketIO () {
    return this[_sio]
  }

  emit (channel, data, callback) {
    if (typeof data === 'function') {
      callback = data
      data = null
    }

    this[_sio].emit(channel, data, callback)
  }
}
export default SIOClient
