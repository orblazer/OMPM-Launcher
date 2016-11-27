/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 20/10/2016
 */
import os from 'os'
import Vuex from 'vuex'
import Settings from '../../store/SettingsStore'
import Alert from '../../store/AlertStore'

export default {
  name: 'Settings',
  store: Settings,
  components: {
    Tabs: require('../../components/tabs/index.vue'),
    Tab: require('../../components/tabs/tab').default
  },
  data () {
    return {
      maxRam: Math.floor(os.totalmem() / 1024000000),
      possibleRam: [],
      general: {
        installPath: '',
        launcherVisibility: ''
      },
      java: {
        installPath: '',
        allocatedRam: ''
      }
    }
  },
  created () {
    this.general = this.$store.getters.settings.general
    this.java = this.$store.getters.settings.java

    for (let i = 1; i <= this.maxRam; i++) {
      this.possibleRam.push(i)
    }
  },
  methods: {
    ...Vuex.mapActions(['saveConfig']),

    /**
     * The game location is change
     */
    gameLocChange () {
      this.general.installPath = this.$refs['gameLocation'].value
    },

    /**
     * The java location is change
     */
    javaLocChange () {
      this.java.installPath = this.$refs['javaLocation'].value
    },

    /**
     * Save the settings
     */
    saveSettings () {
      this.saveConfig(this._data).then(() => {
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
