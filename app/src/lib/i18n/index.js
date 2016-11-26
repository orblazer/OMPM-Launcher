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
    Vue.config.lang = Vue.config.lang.substring(0, Vue.config.lang.indexOf('-'))
  }

  Vue.config.fallbackLang = 'en'

  // Load lang
  return new Promise((resolve) => {
    fs.readdir(langPath, (err, files) => {
      if (err) throw err

      files.forEach((file, index) => {
        Vue.locale(file.replace('.json', ''), JSON.parse(fs.readFileSync(path.join(langPath, file), 'UTF-8')))

        if (index >= (files.length - 1)) {
          resolve()
        }
      })
    })
  })
}
