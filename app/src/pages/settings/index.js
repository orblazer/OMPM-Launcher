/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 20/10/2016
 */
import os from 'os'
import Vuex from 'vuex'
import { remote } from 'electron'
import Settings from '../../store/SettingsStore'
import Alert from '../../store/AlertStore'

export default {
  name: 'Settings',
  store: Settings,
  components: {
    Tabs: require('../../components/Tabs/index.vue'),
    Tab: require('../../components/Tabs/tab').default
  },
  data () {
    return {
      maxRam: Math.floor(os.totalmem() / 1024000000),
      possibleRam: [],
      availableLang: Object.keys(this.$parent.$lang.locales),
      general: {
        installPath: '',
        launcherVisibility: '',
        lang: ''
      },
      java: {
        installPath: '',
        allocatedRam: ''
      }
    }
  },
  created () {
    this.general = Object.assign({}, this.$store.getters.settings.general)
    this.java = Object.assign({}, this.$store.getters.settings.java)

    for (let i = 1; i <= this.maxRam; i++) {
      this.possibleRam.push(i)
    }
  },
  methods: {
    ...Vuex.mapActions(['saveConfig']),

    /**
     * Select the game location
     */
    selectGameLocation () {
      remote.dialog.showOpenDialog({
        title: Vue.t('pages.settings.dialog.gameLocation'),
        properties: ['openDirectory'],
        defaultPath: this.general.installPath
      }, (folderPaths) => {
        if (folderPaths !== undefined) {
          this.$nextTick(() => {
            this.general.installPath = folderPaths[0]
          })
        }
      })
    },

    /**
     * Change the lang
     */
    changeLang () {
      Vue.config.lang = this.general.lang
    },

    /**
     * Select the java home
     */
    selectJavaHome () {
      remote.dialog.showOpenDialog({
        title: Vue.t('pages.settings.dialog.javaHome'),
        properties: ['openDirectory'],
        defaultPath: this.java.installPath
      }, (folderPaths) => {
        if (folderPaths !== undefined) {
          this.$nextTick(() => {
            this.java.installPath = folderPaths[0]
          })
        }
      })
    },

    /**
     * Save the settings
     */
    saveSettings () {
      this.saveConfig({
        general: this.general,
        java: this.java
      }).then(() => {
        Alert.dispatch('alert', {
          message: Vue.t('pages.settings.save.done')
        })
      }).catch(() => {
        Alert.dispatch('alert', {
          type: 'error',
          message: Vue.t('pages.settings.save.fail')
        })
      })
    }
  }
}
