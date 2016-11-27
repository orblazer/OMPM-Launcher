/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 25/10/2016
 */
import ModPacksStore from '../../store/ModPacksStore'

export default {
  name: 'ModPack',
  store: ModPacksStore,
  props: {
    modPackUid: String
  },
  data () {
    return {
      makeInstanceShow: '',
      instanceName: '',
      instanceVersion: '',
      eventListener: null
    }
  },
  components: {
    Tabs: require('../tabs/index.vue'),
    Tab: require('../tabs/tab').default
  },
  created () {
    this.eventListener = (event) => {
      if (event.key === 'Escape') {
        if (this.makeInstanceShow !== '') {
          this.closeInstance()
        } else {
          this.close()
        }
      }
    }

    window.addEventListener('keyup', this.eventListener)
  },
  destroyed () {
    window.removeEventListener('keyup', this.eventListener)
  },
  computed: {
    modPack () {
      return this.$store.getters.modPacks.filter((modPack) => modPack.uid === this.modPackUid)[0]
    }
  },
  methods: {
    /**
     * Close the mod pack information
     */
    close () {
      this.$parent.close()
    },

    /**
     * Close the instance
     */
    closeInstance () {
      this.makeInstanceShow = ''
    },

    /**
     * Make the instance
     * @param {String} mpId The modPack id
     */
    makeInstance (mpId) {
      this.instanceName = this.modPack.name
      this.instanceVersion = this.modPack.version
      this.makeInstanceShow = mpId
    },

    /**
     * Download the instance
     */
    downloadInstance () {

    }
  }
}
