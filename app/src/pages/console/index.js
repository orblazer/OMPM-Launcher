/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 26/10/2016
 */
import fs from 'fs'
import LauncherLog from '../../lib/log/LauncherLog'

export default {
  name: 'Console',
  components: {
    Tabs: require('../../components/tabs/index').default,
    Tab: require('../../components/tabs/tab').default
  },
  data () {
    return {
      autoScroll: true,
      launcherLog: ''
    }
  },
  created () {
    this.updateLauncherLog()
    fs.watchFile(LauncherLog.logFile, () => {
      this.updateLauncherLog()
    })
  },
  beforeDestroy () {
    fs.unwatchFile(LauncherLog.logFile)
  },
  watch: {
    launcherLog () {
      const el = document.getElementById('launcherLog')
      if (el && this.autoScroll) {
        el.scrollTop = el.scrollHeight - el.scrollTop
      }
    }
  },
  methods: {
    /**
     * Update the launcher log
     */
    updateLauncherLog () {
      const logs = fs.readFileSync(LauncherLog.logFile, 'utf8').split('\n')
      logs.forEach((log, key) => {
        const match = /\[([A-Z]+)\]/.exec(log)

        if (match !== null) {
          const hoursMatch = /\[(\d+:\d+:\d+)\]/.exec(log)
          if (hoursMatch !== null) {
            log = log.replace(hoursMatch[1], `<span class="date">${hoursMatch[1]}</span>`)
          }

          logs[key] = `<span class="${match[1].toLowerCase()}">${log}</span>`
        }
      })

      this.launcherLog = logs.join('<br>')
    }
  }
}
