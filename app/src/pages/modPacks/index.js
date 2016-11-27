/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 18/10/2016
 */
import ModPack from '../../components/modPack/index.vue'
import ModPacksStore from '../../store/ModPacksStore'

export default {
  name: 'modPacks',
  store: ModPacksStore,
  components: {
    ModPack
  },
  props: {
    type: {
      type: String,
      default: 'public',
      validator (val) {
        return ~['public', 'private', 'reserved'].indexOf(val)
      }
    }
  },
  data () {
    return {
      moreInfoShow: ''
    }
  },
  computed: {
    modPacks () {
      return this.$store.getters.modPacks.filter((modPack) => this.type.toUpperCase() === modPack.type)
    }
  },
  methods: {
    view (mpId) {
      this.moreInfoShow = mpId
    },
    close () {
      this.moreInfoShow = ''
    },
    formatDate (date) {
      if (!(date instanceof Date)) {
        date = new Date(date)
      }

      function addZero (number) {
        return ('0' + number).slice(-2)
      }

      return addZero(date.getDate()) + '/' + addZero((date.getMonth() + 1)) + '/' + addZero(date.getFullYear())
    }
  }
}
