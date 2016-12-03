/**
 * Relonar.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 12/11/2016
 */
export default {
  name: 'Navigation',
  data () {
    return {
      canManage: this.$parent.$data.canAccessMPEditor || this.$parent.$data.canAccessAdmin,
      canAdmin: this.$parent.$data.canAccessAdmin
    }
  },
  computed: {
    serverAvailable () {
      return this.$parent.serverAvailable
    },
    loggedIn () {
      return this.$parent.loggedIn
    }
  }
}
