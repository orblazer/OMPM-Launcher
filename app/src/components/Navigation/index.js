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
      serverAvailable: this.$parent.$data.serverAvailable,
      canManage: this.$parent.$data.canAccessMPEditor || this.$parent.$data.canAccessAdmin,
      canAdmin: this.$parent.$data.canAccessAdmin,
      loggedIn: this.$parent.$data.loggedIn
    }
  }
}
