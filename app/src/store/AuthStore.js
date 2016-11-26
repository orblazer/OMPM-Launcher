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
import AuthInfo from '../lib/mojang/minecraft/AuthInfo'
import AuthenticationException from '../lib/mojang/authenticator/AuthenticationException'
import AuthError from '../lib/mojang/authenticator/model/AuthError'

export default new Vuex.Store({
  strict: true,
  state: {
    accessToken: '',
    auth: null,
    email: '',
    password: ''
  },
  mutations: {
    LOGIN (state, info) {
      state.accessToken = info.auth.accessToken
      state.auth = info.auth
      state.email = info.email
      state.password = info.password
    },
    LOGOUT (state) {
      state.token = ''
      state.auth = null
    }
  },
  getters: {
    accessToken: state => state.accessToken,
    auth: state => state.auth,
    loggedIn: state => !!state.accessToken
  },
  actions: {
    login (store, { email, password }) {
      return new Promise((resolve, reject) => {
        if (!store.getters.loggedIn) {
          const auth = new Authenticator(Authenticator.MOJANG_AUTH_URL, AuthPoints.NORMAL_AUTH_POINTS)
          const response = auth.authenticate(AuthAgent.MINECRAFT, email, password)

          response.then((response) => {
            store.commit('LOGIN', {
              auth: new AuthInfo(response.selectedProfile.name, response.accessToken, response.selectedProfile.id),
              email: email,
              password: password
            })

            resolve({ token: store.state.token, auth: store.state.auth })
          }).catch(reject)
        } else {
          reject(new AuthenticationException(new AuthError('IllegalStateException', 'Already Connected')))
        }
      })
    },
    logout (store) {
      return new Promise((resolve, reject) => {
        if (store.getters.loggedIn) {
          const auth = new Authenticator(Authenticator.MOJANG_AUTH_URL, AuthPoints.NORMAL_AUTH_POINTS)
          const response = auth.signout(store.state.email, store.state.password)

          response.then(() => {
            store.commit('LOGOUT')
            resolve()
          }).catch(reject)
        } else {
          resolve()
        }
      })
    }
  }
})
