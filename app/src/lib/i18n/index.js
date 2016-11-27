/**
 * OMPM_launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 25/11/2016
 */
import { remote } from 'electron'
import VueI18n from 'vue-i18n'
import fs from 'fs'
import path from 'path'

const langPath = path.join('app', 'src', 'assets', 'lang')
export default (Vue) => {
  Vue.use(VueI18n)

  // set lang
  Vue.config.lang = remote.app.getLocale()
  if (Vue.config.lang.indexOf('-') > 1) {
    const lang = Vue.config.lang.split('-')
    Vue.config.lang = lang[0] + '_' + lang[1].toUpperCase()
  } else {
    switch (Vue.config.lang.toLowerCase()) {
      case 'fr':
        Vue.config.lang = 'fr_FR'
        break

      default:
        Vue.config.lang = 'en_US'
        break
    }
  }

  Vue.config.fallbackLang = 'en_US'

  // Load lang
  return new Promise((resolve) => {
    fs.readdir(langPath, (err, files) => {
      if (err) throw err

      function loadLang () {
        files.forEach((file, index) => {
          Vue.locale(file.replace('.json', ''), JSON.parse(fs.readFileSync(path.join(langPath, file), 'UTF-8')))

          if (index >= (files.length - 1)) {
            resolve()
          }
        })
      }

      loadLang()
    })
  })
}
