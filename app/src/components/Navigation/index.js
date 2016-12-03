/**
 * Relonar.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 12/11/2016
 */
import AuthStore from '../../store/AuthStore'

export default {
  name: 'Navigation',
  computed: {
    serverAvailable () {
      return this.$parent.serverAvailable
    },
    loggedIn () {
      return this.$parent.loggedIn
    },
    user () {
      return AuthStore.getters.user
    }
  }
}
