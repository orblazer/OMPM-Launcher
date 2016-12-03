/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 17/10/2016
 */
import Vuex from 'vuex'
import Authenticator from '../lib/mojang/authenticator/Authenticator'
import AuthPoints from '../lib/mojang/authenticator/AuthPoints'
import AuthAgent from '../lib/mojang/authenticator/model/AuthAgent'
import AuthProfile from '../lib/mojang/authenticator/model/AuthProfile'
import AuthInfo from '../lib/mojang/minecraft/AuthInfo'
import AuthenticationException from '../lib/mojang/authenticator/AuthenticationException'
import AuthError from '../lib/mojang/authenticator/model/AuthError'
import { generateUUID } from '../lib/uuid'

export default new Vuex.Store({
  strict: true,
  state: {
    accessToken: '',
    auth: null,
    user: {
      mpEditor_access: false,
      admin_access: false
    },
    email: null,
    password: null
  },
  mutations: {
    /**
     * Set the authentication
     * @param {Object} state The state
     * @param {Object} info The info of player
     * @constructor
     */
    LOGIN (state, info) {
      state.accessToken = info.auth.accessToken
      state.auth = info.auth
      state.email = info.email
      state.password = info.password
    },

    /**
     * Set the user login
     * @param {Object} state The state
     * @param {Object} user The user
     * @constructor
     */
    USER_LOGIN (state, user) {
      state.user = user
    },

    /**
     * Remove the authentication
     * @param {Object} state The state
     * @constructor
     */
    LOGOUT (state) {
      state.accessToken = ''
      state.auth = null
      state.user = null
    }
  },
  getters: {
    accessToken: state => state.accessToken,
    auth: state => state.auth,
    user: state => state.user,
    loggedIn: state => !!state.accessToken
  },
  actions: {
    /**
     * Login the player
     * @param {Object} store The store
     * @param {String} email The email of account
     * @param {String} password The password of account
     * @return {Promise} The promise of login
     */
    login (store, { email, password }) {
      return new Promise((resolve, reject) => {
        const auth = new Authenticator(Authenticator.MOJANG_AUTH_URL, AuthPoints.NORMAL_AUTH_POINTS)

        if (!store.getters.loggedIn) {
          auth.authenticate(AuthAgent.MINECRAFT, email, password, generateUUID().replace(/-/g, '')).then((response) => {
            store.commit('LOGIN', {
              auth: new AuthInfo(response.selectedProfile.name, response.accessToken, response.clientToken, response.selectedProfile.id),
              email: email,
              password: password
            })

            sioClient.emit('login', response.selectedProfile.id, (user) => {
              store.commit('USER_LOGIN', user)
            })
            sioEvent.once('connected', () => {
              sioClient.emit('login', response.selectedProfile.id, (user) => {
                console.info('Auto reconnect')
                store.commit('USER_LOGIN', user)
              })
            })

            resolve({ token: store.state.token, auth: store.state.auth })
          }).catch(reject)
        } else {
          auth.validate(store.getters.accessToken, store.getters.auth.clientToken).then(() => {
            resolve({ token: store.state.token, auth: store.state.auth })
          }).catch(() => {
            auth.refresh(store.getters.accessToken, store.getters.auth.clientToken, new AuthProfile(store.getters.auth.UUID, store.getters.auth.name)).then((response) => {
              store.commit('LOGIN', {
                auth: new AuthInfo(response.selectedProfile.name, response.accessToken, response.clientToken, response.selectedProfile.id),
                email: email,
                password: password
              })

              resolve({ token: store.state.token, auth: store.state.auth })
            }).catch((response) => {
              console.error('REFRESHERR', response)

              reject(new AuthenticationException(new AuthError('IllegalStateException', 'Already Connected')))
            })
          })
        }
      })
    },

    /**
     * Logout the player
     * @param {Object} store The store
     * @return {Promise} The promise of logout
     */
    logout (store) {
      return new Promise((resolve, reject) => {
        if (store.getters.loggedIn) {
          const auth = new Authenticator(Authenticator.MOJANG_AUTH_URL, AuthPoints.NORMAL_AUTH_POINTS)
          auth.signout(store.state.email, store.state.password).then(() => {
            store.commit('LOGOUT')
            sioClient.emit('logout')

            resolve()
          }).catch(reject)
        } else {
          reject(new AuthenticationException(new AuthError('IllegalStateException', 'You are not connected')))
        }
      })
    }
  }
})
