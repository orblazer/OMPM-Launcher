/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 06/11/2016
 */
import ManageStore from '../../store/ManageStore'
import AuthStore from '../../store/AuthStore'
import Tabs from '../../components/Tabs/index.vue'
import Tab from '../../components/Tabs/tab'
import MPEditor from '../../components/MPEditor/index.vue'

export default {
  name: 'Manage',
  store: ManageStore,
  components: {
    Tabs,
    Tab,
    MPEditor
  },
  data () {
    return {
      canAccessAdmin: AuthStore.getters.user.admin_access
    }
  },
  computed: {
    modPacks () {
      return this.$store.getters.modPacks
    }
  }
}
