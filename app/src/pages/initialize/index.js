/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 27/10/2016
 */
import Vue from 'vue'
import { remote } from 'electron'
import SIOClient from '../../lib/SocketIO/SIOClient'
import LauncherLog from '../../lib/log/LauncherLog'
import VersionsStore from '../../store/VersionsStore'
import ModPacksStore from '../../store/ModPacksStore'
import InstancesStore from '../../store/InstancesStore'
import SettingsStore from '../../store/SettingsStore'
import progressBar from '../../components/progressBar/index.vue'
const serverUrl = 'http://download.relonar.fr/tmpLauncher/'

export default {
  name: 'Initialize',
  components: {
    progressBar
  },
  data () {
    return {
      progress: 0,
      step: 6,
      status: Vue.t('initialize.loading')
    }
  },
  mounted () {
    setTimeout(() => {
      this.checkServer()
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
    doneLoading (redirect) {
      if (redirect === undefined) {
        if (this.$parent.$route.query.redirect === '/initialize') {
          this.$parent.$route.query.redirect = '/modPacks'
        }

        this.$parent.$router.push(this.$parent.$route.query.redirect)
      } else {
        this.$parent.$router.push(redirect)
      }
      remote.getCurrentWindow().setProgressBar(0)
    },

    /**
     * Check the server
     */
    checkServer () {
      this.status = Vue.t('initialize.checkServer.loading')
      const cantConnect = () => {
        this.status = Vue.t('initialize.checkServer.fail')
        this.increaseProgress()
        LauncherLog.error('Can\'t connect to server, use local launcher')
        setTimeout(() => {
          // this.doneLoading('/instances')
        }, 100)
      }

      this.$http.get('http://localhost:8080/').then(() => {
        this.$parent.serverAvailable = true
        let runned = false
        // noinspection Eslint
        new SIOClient(() => {
          if (!runned) {
            runned = true
            this.increaseProgress()
            this.checkUpdate()
          }
        }, cantConnect)
      }).catch(cantConnect)
    },

    /**
     * Check the update
     */
    checkUpdate () {
      this.status = Vue.t('initialize.checkUpdate.loading')
      Vue.http.post(serverUrl + 'version').then((response) => {
        const currVersion = require('../../../package.json').version

        if (response.body !== currVersion) {
          this.downloadUpdate()
          this.step = 4
          this.increaseProgress()
        } else {
          this.status = Vue.t('initialize.checkUpdate.upToDate')
          this.increaseProgress()

          setTimeout(() => {
            this.getVersions()
          }, 100)
        }
      }).catch(function () {
        console.warn(arguments)
      })
    },

    /**
     * Download the update
     */
    downloadUpdate () {
      this.status = 'Téléchargement des mises à jour...'
      // TODO 27/10/2016 Make this !!!!!!
    },

    /**
     * Get the versions
     */
    getVersions () {
      this.status = 'Chargement des versions disponnible...'
      VersionsStore.dispatch('initialize').then(() => {
        this.status = 'Les versions disponnible ont été chargé.'
        this.increaseProgress()

        setTimeout(() => {
          this.getModPacks()
        }, 100)
      }).catch((err) => {
        console.error(err)
      })
    },

    /**
     * Get the mod packs
     */
    getModPacks () {
      this.status = 'Chargement des packs de mods...'
      ModPacksStore.dispatch('initialize').then(() => {
        this.status = 'Les packs de mods ont été chargé.'
        this.increaseProgress()

        setTimeout(() => {
          this.getInstances()
        }, 100)
      }).catch((err) => {
        console.error(err)
      })
    },

    /**
     * Get the instances
     */
    getInstances () {
      this.status = 'Chargement des instances...'
      InstancesStore.dispatch('initialize').then(() => {
        this.status = 'Les instances ont été chargé.'
        this.increaseProgress()

        setTimeout(() => {
          this.getSettings()
        }, 100)
      }).catch((err) => {
        console.error(err)
      })
    },

    /**
     * Get the settings
     */
    getSettings () {
      this.status = 'Chargement des paramètres...'
      SettingsStore.dispatch('initialize').then(() => {
        this.status = 'Les paramètres ont été chargé'
        this.increaseProgress()

        setTimeout(() => {
          this.doneLoading()
        }, 100)
      }).catch((err) => {
        console.error(err)
      })
    }
  }
}
