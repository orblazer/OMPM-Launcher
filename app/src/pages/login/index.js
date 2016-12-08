/**
 * OMPM_launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 02/12/2016
 */
import Vuex from 'vuex'
import AuthStore from '../../store/AuthStore'
import Alert from '../../store/AlertStore'
import LauncherLog from '../../lib/log/LauncherLog'

// noinspection Eslint
const emailRegex = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@\"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+.)+[^<>()[\].,;:\s@"]{2,})$/i
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/i

export default {
  name: 'Login',
  store: AuthStore,
  data () {
    return {
      email: '',
      password: '',
      input: {
        emailClass: '',
        passwordClass: '',
        submitEnabled: true
      }
    }
  },
  methods: {
    ...Vuex.mapActions({
      _authLogin: 'login'
    }),
    login () {
      if ((this.input.emailClass === 'error') || (this.input.passwordClass === 'error')) {
        return
      }
      LauncherLog.debug('Send login request...')

      /* App.$router.push(App.$route.query.redirect)
      LauncherLog.debug('Login successful')
      return */

      this.input.submitEnabled = false
      this._authLogin({ email: this.email, password: this.password }).then(() => {
        LauncherLog.debug('Login successful')
        Alert.dispatch('alert', {
          message: Vue.t('pages.login.alert.success')
        }).then(() => {
          App.$router.push(App.$route.query.redirect || '/modPacks')
        })
      }).catch((error) => {
        if (error.message === 'No Connection') {
          LauncherLog.debug('Can\'t connect, no connection')
          Alert.dispatch('alert', {
            type: 'error',
            message: Vue.t('pages.login.alert.noConnection')
          })
        } else if (error.message === 'Already Connected') {
          LauncherLog.debug('Can\'t connect, already connected')

          Alert.dispatch('alert', {
            type: 'error',
            message: Vue.t('pages.login.alert.already')
          })
        } else if (error.message.includes('Invalid username or password.')) {
          LauncherLog.debug('Can\'t connect, invalid username or password')

          Alert.dispatch('alert', {
            type: 'error',
            message: Vue.t('pages.login.alert.invalid')
          })
        } else {
          throw error
        }
        this.input.submitEnabled = true
      })
    },
    validate (value, type) {
      if (type === 'email') {
        if (emailRegex.test(value)) {
          this.input.emailClass = 'success'
        } else {
          this.input.emailClass = 'error'
        }
      } else if (type === 'password') {
        if (passwordRegex.test(value)) {
          this.input.passwordClass = 'success'
        } else {
          this.input.passwordClass = 'error'
        }
      }
    }
  },
  watch: {
    email (value) {
      this.validate(value, 'email')
    },
    password (value) {
      this.validate(value, 'password')
    }
  },
  mounted () {
    if (this.email !== '') {
      this.validate(this.email, 'email')
    }
    if (this.password !== '') {
      this.validate(this.password, 'password')
    }
  }
}
