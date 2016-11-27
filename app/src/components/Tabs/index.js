/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 20/10/2016
 */
export default {
  name: 'Tabs',
  data () {
    return {
      tabs: [],
      isActive: '',
      _activeCount: 0
    }
  },
  created () {
    this.$on('tab-created', (msg, active = false) => {
      if (active) {
        if (++this._activeCount > 1) {
          throw new RangeError('You can only have one element activate.')
        }

        this.isActive = msg
      }

      this.tabs.push({ message: msg, active: active })
    })
  },
  methods: {
    /**
     * Open the tab
     * @param {String} msg The header of tab (key)
     */
    open (msg) {
      this.isActive = msg.message
      this.$emit('tab-activated', msg.message)
    }
  }
}
