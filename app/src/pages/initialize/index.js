/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 27/10/2016
 */
import { remote } from 'electron'
import SIOClient from '../../lib/SocketIO/SIOClient'
import LauncherLog from '../../lib/log/LauncherLog'
import VersionsStore from '../../store/VersionsStore'
import ModPacksStore from '../../store/ModPacksStore'
import InstancesStore from '../../store/InstancesStore'
import SettingsStore from '../../store/SettingsStore'
import ProgressBar from '../../components/ProgressBar/index.vue'

export default {
  name: 'Initialize',
  components: {
    ProgressBar
  },
  data () {
    return {
      progress: 0,
      step: 6,
      status: Vue.t('pages.initialize.loading')
    }
  },
  mounted () {
    setTimeout(() => {
      this.getSettings()
    }, 1000)
  },
  methods: {
    /**
     * Increase the progress
     */
    increaseProgress () {
      this.progress += (1 / this.step) * 100
      remote.getCurrentWindow().setProgressBar(this.progress / 100)
    },

    /**
     * End the loading
     * @param {Object} redirect The redirect
     */
    doneLoading (redirect = undefined) {
      if (redirect === undefined) {
        if (this.$parent.$route.query.redirect === '/initialize') {
          this.$parent.$route.query.redirect = '/login'
        }

        this.$parent.$router.push(this.$parent.$route.query.redirect || '/login')
      } else {
        this.$parent.$router.push(redirect)
      }
      remote.getCurrentWindow().setProgressBar(0)
    },

    /**
     * Get the settings
     */
    getSettings () {
      this.status = Vue.t('pages.initialize.settings.loading')
      SettingsStore.dispatch('initialize').then((settings) => {
        Vue.config.lang = settings.general.lang

        this.status = Vue.t('pages.initialize.settings.done')
        this.increaseProgress()

        setTimeout(() => {
          this.checkServer()
        }, 100)
      }).catch((err) => {
        this.status = Vue.t('pages.initialize.settings.fail')
        this.increaseProgress()

        setTimeout(() => {
          this.checkServer()
        }, 100)

        console.error(err)
      })
    },

    /**
     * Check the server
     */
    checkServer () {
      this.status = Vue.t('pages.initialize.checkServer.loading')
      const cantConnect = () => {
        this.status = Vue.t('pages.initialize.checkServer.fail')
        this.increaseProgress()
        LauncherLog.error('Can\'t connect to server, use local launcher')

        setTimeout(() => {
          this.doneLoading('/instances')
        }, 200)
      }

      let runned = false
      let tryConnect = 0

      // noinspection Eslint
      new SIOClient(() => {
        if (!runned) {
          runned = true
          this.increaseProgress()
          this.checkUpdate()
        }
      }, (reason) => {
        if (!runned) {
          if (reason.message === 'xhr poll error') {
            if (++tryConnect >= 5) {
              runned = true
              cantConnect()
            }
            console.warn('Try connect (' + tryConnect + ')')
          } else {
            console.error(reason)
            runned = true
            cantConnect()
          }
        }
      })
    },

    /**
     * Check the update
     */
    checkUpdate () {
      this.status = Vue.t('pages.initialize.checkUpdate.loading')

      sioClient.emit('checkVersion', (version) => {
        if (App.version !== version) {
          this.downloadUpdate()
          this.step += 1
          this.increaseProgress()
        } else {
          this.status = Vue.t('pages.initialize.checkUpdate.upToDate')
          this.increaseProgress()

          setTimeout(() => {
            this.getVersions()
          }, 100)
        }
      })
    },

    /**
     * Download the update
     */
    downloadUpdate () {
      this.status = Vue.t('pages.initialize.downloadUpdate.loading')
      // TODO 27/10/2016 Make this !!!!!!
    },

    /**
     * Get the versions
     */
    getVersions () {
      this.status = Vue.t('pages.initialize.versions.loading')
      VersionsStore.dispatch('initialize').then(() => {
        this.status = Vue.t('pages.initialize.versions.done')
        this.increaseProgress()

        setTimeout(() => {
          this.getModPacks()
        }, 100)
      }).catch((err) => {
        this.status = Vue.t('pages.initialize.versions.fail')
        this.increaseProgress()

        console.error(err)
      })
    },

    /**
     * Get the mod packs
     */
    getModPacks () {
      this.status = Vue.t('pages.initialize.modPacks.loading')
      let handleError = (err) => {
        this.status = Vue.t('pages.initialize.modPacks.fail')
        this.increaseProgress()

        console.error(err)
      }

      ModPacksStore.dispatch('initialize').then(() => {
        // MyModPacksStore.dispatch('initialize').then(() => {
        // MyRequestsStore.dispatch('initialize').then(() => {
        this.status = Vue.t('pages.initialize.modPacks.done')
        this.increaseProgress()

        setTimeout(() => {
          this.getInstances()
        }, 100)
        // }).catch(handleError)
        // }).catch(handleError)
      }).catch(handleError)
    },

    /**
     * Get the instances
     */
    getInstances () {
      this.status = Vue.t('pages.initialize.instances.loading')
      InstancesStore.dispatch('initialize').then(() => {
        this.status = Vue.t('pages.initialize.instances.done')
        this.increaseProgress()

        setTimeout(() => {
          this.doneLoading()
        }, 100)
      }).catch((err) => {
        this.status = Vue.t('pages.initialize.instances.fail')
        this.doneLoading()

        console.error(err)
      })
    }
  }
}
