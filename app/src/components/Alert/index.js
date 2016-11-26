/**
 * Relonar.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 12/11/2016
 */
import AlertStore from '../../store/AlertStore'

export default {
  name: 'Alert',
  store: AlertStore,
  props: {
    alertType: {
      type: String,
      default: 'all',
      validator (val) {
        return !!(~['success', 'warning', 'error', 'all'].indexOf(val))
      }
    },
    maxStack: {
      type: Number,
      default: 2,
      validator (val) {
        return (val === -1) || (val >= 1)
      }
    }
  },
  computed: {
    /**
     * Print the alerts
     * @return {Array} The array of alerts
     */
    alerts () {
      if (this.maxStack === -1) {
        return Object.values(this.$store.getters.alerts).filter((alert) => (this.alertType === 'all') || (this.alertType === alert.type))
      } else {
        const alerts = Object.values(this.$store.getters.alerts).filter((alert) => (this.alertType === 'all') || (this.alertType === alert.type))
        return alerts.slice(alerts.length - this.maxStack, alerts.length)
      }
    }
  }
}
