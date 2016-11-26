/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 20/10/2016
 */
export default {
  name: 'Tabs-content',
  props: {
    header: String,
    active: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      activated: false
    }
  },
  template: '<div v-show="activated"><slot></slot></div>',
  created () {
    this.$parent.$emit('tab-created', this.header, this.active)
    this.activated = this.active

    this.$parent.$on('tab-activated', (msg) => {
      this.activated = this.header === msg
    })
  }
}
