/**
 * OMPM_launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 25/11/2016
 */
global.Vue = require('vue/dist/vue')
import os from 'os'
import path from 'path'
import Vuex from 'vuex'
import Resource from 'vue-resource'
import { remote } from 'electron'
import i18n from './lib/i18n'
import LauncherLog from './lib/log/LauncherLog'

Vue.use(Resource)
Vue.use(Vuex)
Vue.config.debug = true

i18n(Vue).then(() => {
  const AuthStore = require('./store/AuthStore').default
  const Router = require('./router').default

  /**
   * Initialize Vue
   */
  global.App = new Vue({
    router: Router(Vue),
    data: {
      version: require('../package.json').version,
      serverAvailable: false,
      canAccessMPEditor: false,
      canAccessAdmin: false
    },
    computed: {
      loggedIn () {
        return AuthStore.getters.loggedIn
      }
    },
    created () {
      LauncherLog.debug('Launch core...')
      this.logComputerInfo()
    },
    beforeMount () {
      if (this.$route.path !== '/initialize') {
        this.$router.push({
          path: '/initialize',
          query: { redirect: this.$route.path }
        })
      }
    },
    mounted () {
      LauncherLog.debug('Core is launched')
    },
    methods: {
      /**
       * Hide the window
       */
      window_hide () {
        remote.getCurrentWindow().minimize()
      },
      /**
       * Close the window
       */
      window_close () {
        remote.getCurrentWindow().close()
      },

      /**
       * Log the computer info
       */
      logComputerInfo () {
        let platform = process.platform
        const javaHome = process.env.JAVA_HOME
        const javaVersion = javaHome.slice(javaHome.lastIndexOf(path.sep) + 1, javaHome.length).replace(/jdk|jre/i, '')

        if (platform === 'darwin') {
          platform = 'Mac OS X'
        } else if (platform === 'freebsd') {
          platform = 'Free BSD'
        } else if (platform === 'linux') {
          platform = 'Linux'
        } else if (platform === 'sunos') {
          platform = 'Sunos'
        } else if (platform === 'win32') {
          platform = 'Windows'
        } else {
          platform = 'Unknown'
        }
        platform += ' ' + os.release().slice(0, os.release().indexOf('.'))

        LauncherLog.log('==========================================')
        LauncherLog.log('= Os : ' + platform + ' (' + os.arch() + ', v: ' + os.release() + ')')
        LauncherLog.log('= Processor : ' + os.cpus()[0].model + ' (arch : ' + process.env.PROCESSOR_ARCHITECTURE + ')')
        LauncherLog.log('= Max ram : ' + Math.floor(os.totalmem() / 1024000000) + ' Go')
        LauncherLog.log('= Java : ' + javaVersion + ' (Path : ' + javaHome + ')')
        LauncherLog.log('= Current directory : ' + process.cwd())
        LauncherLog.log('= Versions :')
        LauncherLog.log('=  - launcher : ' + this.version)
        LauncherLog.log('=  - node : ' + process.versions.node + ' (Electron : ' + process.versions.electron + ')')
        LauncherLog.log('=  - chrome : ' + process.versions.chrome + ' (v8 :' + process.versions.v8 + ')')
        LauncherLog.log('==========================================')
      }
    },
    ...require('./App.vue')
  }).$mount('#app')

  /**
   * Logout when app is quit
   */
  remote.app.on('quit', () => {
    AuthStore.dispatch('logout').then(() => {
      this.close(true)
      LauncherLog.clearLog()
    }).catch(() => {
      this.close(false)
      LauncherLog.error('Can\'t disconnect user')
    })
  })
})
