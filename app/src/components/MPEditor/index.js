/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 25/10/2016
 */
import fs from 'fs'
import path from 'path'
import { remote } from 'electron'
import ProgressBar from '../ProgressBar/index.vue'
import Alert from '../../store/AlertStore'
import VersionsStore from '../../store/VersionsStore'
import SettingsStore from '../../store/SettingsStore'
import ReadZip from '../../lib/ReadZip/ReadZip'
import LauncherLog from '../../lib/log/LauncherLog'

const _parseMcMod = /"(modid|name|version|authors|authorList|description|mcversion)": (.*),/g

export default {
  name: 'MPEditor',
  store: VersionsStore,
  components: {
    ProgressBar
  },
  data () {
    return {
      modPack: {
        name: 'Feed The Nuclear',
        smallDesc: 'Le modpack est un pack principalement orienté sur la technologie mais il contient aussi des mods magique pour plaire au plus de monde possible. Nous essayons de toujours garder les pack de mods à jour, cela permet une expérience de jeu optimale mais aussi de trouver les bugs présent dans les mods afin de les améliorer.',
        version: '1.0',
        authors: 'orblazer, buildmaxcraft, mjpyroman',
        mcVersion: this.$store.getters.mcVersions[0].version,
        forgeVersion: this.$store.getters.forgeVersions[1].forgeVersion,
        type: 'public',
        logo: null,
        description: '',
        changelog: '',
        mods: []
      },
      mpLocation: '',
      mpLogo: '',
      zipFile: null,
      step: 0,
      canNextStep: false,
      total: 0,
      current: 0,
      uploadProgress: 0,
      readZip: null,
      loaded: false
    }
  },
  computed: {
    mcVersions () {
      return this.$store.getters.mcVersions
    },
    forgeVersions () {
      return this.$store.getters.forgeVersions.filter((forgeVersion) => forgeVersion.mcVersion === this.modPack.mcVersion)
    }
  },
  watch: {
    modPack: {
      handler () {
        this.checkCanNextStep()
      },
      deep: true
    }
  },
  mounted () {
    this.checkCanNextStep()
    const self = this

    this._DSL_TinyMCE().then(() => {
      // Config for TinyMCE
      const tinyConfig = {
        selector: 'textarea#mpDescription',
        height: 260,
        resize: false,
        skin: 'ompm_launcher',
        plugins: ['wordcount', 'autolink', 'contextmenu', 'link', 'image', 'media', 'preview', 'textcolor', 'colorpicker'],
        menubar: false,
        media_alt_source: false,
        media_poster: false,
        media_dimensions: false,
        image_dimensions: false,
        default_link_target: '_blank',
        link_assume_external_targets: true,
        target_list: false,
        relative_urls: false,
        contextmenu_never_use_native: true,
        contextmenu: 'link image media',
        elementpath: false,
        cleanup: true,
        urlconverter_callback: (url) => url.startsWith('//') ? 'http:' + url : url,
        toolbar: [
          'undo redo | styleselect | bold italic underline | link image media | alignleft aligncenter alignright | preview | forecolor'
        ],
        style_formats: [{
          title: 'Title',
          items: [
            { title: 'Header 1', format: 'h1' },
            { title: 'Header 2', format: 'h2' },
            { title: 'Header 3', format: 'h3' }
          ]
        }, {
          title: 'Inline',
          items: [
            { title: 'Strikethrough', icon: 'strikethrough', format: 'strikethrough' },
            { title: 'Superscript', icon: 'superscript', format: 'superscript' },
            { title: 'Subscript', icon: 'subscript', format: 'subscript' }
          ]
        }],
        setup (editor) {
          editor.on('NodeChange', () => {
            self.modPack.description = editor.getContent()
          })
        }
      }
      tinyMCE.baseURL = window.location.origin + '/assets/tinymce'
      if (Vue.config.lang !== 'en_US') {
        tinyConfig.language = Vue.config.lang
      } else {
        tinyConfig.language = 'en'
      }

      // Initialize TinyMCE for mod pack description
      tinyMCE.init(tinyConfig)

      tinyConfig.selector = 'textarea#mpChangelog'
      tinyConfig.setup = (editor) => {
        editor.on('NodeChange', () => {
          self.modPack.changelog = editor.getContent()
        })
      }
      // Initialize TinyMCE for mod pack changelog
      tinyMCE.init(tinyConfig)
    })
  },
  beforeDestroy () {
    const editor = tinyMCE.get('mpDescription')
    if (editor !== null) {
      editor.remove()
    }

    const editor2 = tinyMCE.get('mpChangelog')
    if (editor2 !== null) {
      editor2.remove()
    }
  },
  methods: {
    /**
     * Load dynamically TinyMCE
     * @return {Promise} The promise of load
     * @private
     */
    _DSL_TinyMCE () {
      return new Promise((resolve) => {
        if (typeof tinyMCE === 'undefined') {
          const scriptElem = document.createElement('script')
          scriptElem.setAttribute('type', 'text/javascript')
          scriptElem.setAttribute('src', '/assets/tinymce/tinymce.min.js')
          scriptElem.addEventListener('load', () => {
            resolve()
          })

          document.body.appendChild(scriptElem)
          document.body.removeChild(scriptElem)
        } else {
          resolve()
        }
      })
    },

    /**
     * Check if step is valid
     */
    checkCanNextStep () {
      if (this.step === 1) {
        this.canNextStep = (this.modPack.name.length >= 5) && (this.modPack.smallDesc.length >= 50) &&
          (this.modPack.version.length >= 3) && (this.modPack.mcVersion !== '') &&
          (this.modPack.forgeVersion !== '')
      } else if (this.step === 2) {
        this.canNextStep = this.mpLogo && this.modPack.changelog
      } else if ((this.step === 3) && this.loaded) {
        this.canNextStep = (this.modPack.mods.filter((mod) => ((mod.name.length > 0) && (mod.version.length > 0) &&
        (mod.type.length > 0) && (mod.authors.length > 0))).length === this.modPack.mods.length)
      }
    },

    /**
     * Switch to the next step
     */
    nextStep () {
      this.step++
      this.canNextStep = false
      this.checkCanNextStep()

      if (this.step === 3) {
        this._exploreMods()
      } else if (this.step === 4) {
        this.loaded = false
        sioClient.uploader.submitFiles(this.zipFile)

        const progressEvent = (event) => {
          this.uploadProgress = (event.bytesLoaded / event.file.size * 100).toFixed(2)
        }
        const completeEvent = (event) => {
          sioClient.uploader.removeEventListener('progress', progressEvent)
          sioClient.uploader.removeEventListener('complete', completeEvent)

          if (event.success) {
            this.loaded = true
            sioClient.emit('addModPack', this.modPack)
          }
        }

        sioClient.uploader.addEventListener('progress', progressEvent)
        sioClient.uploader.addEventListener('complete', completeEvent)
      }
    },

    /**
     * Switch to previous step
     */
    previousStep () {
      this.step--
      this.canNextStep = true
      this.checkCanNextStep()
    },

    /**
     * Select the mod pack file
     */
    selectMpFile () {
      remote.dialog.showOpenDialog({
        title: Vue.t('components.mpEditor.selectMpLocation'),
        properties: ['openFile'],
        defaultPath: SettingsStore.getters.settings.general.installPath,
        filters: [{
          name: 'Zip Files',
          extensions: ['zip']
        }]
      }, (filePaths) => {
        if (filePaths !== undefined) {
          LauncherLog.debug('Loading mod pack zip (' + filePaths[0] + ')')
          this.readZip = new ReadZip(filePaths[0])
          const containsFolders = this.readZip.getDirectories().filter((entry) => (entry.entryName === 'config/') || (entry.entryName === 'mods/')).length === 2

          if (containsFolders) {
            const correct = (this.readZip.getFiles(/mods(?:\/|\\)(.*\.jar)$/).length > 0) &&
              (this.readZip.getFiles(/config(?:\/|\\)(.*(?:\.cfg|\.json))/).length > 0)

            if (!correct) {
              LauncherLog.debug('The mod pack zip "' + filePaths[0] + '" is not correct')
              Alert.dispatch('alert', {
                type: 'error',
                message: Vue.t('components.mpEditor.mpLocationIncorrect')
              })
            } else {
              LauncherLog.debug('The mod pack zip "' + filePaths[0] + '" is loaded')
              this.mpLocation = filePaths[0]
              this.zipFile = fs.readFileSync(filePaths[0])
              this.nextStep()
            }
          }
        }
      })
    },

    /**
     * Explore the mods of file
     * @private
     */
    _exploreMods () {
      const modFiles = this.readZip.getFiles(/mods(?:\/|\\)(.*(?:\.jar|\.zip))$/)
      this.total = modFiles.length

      const exploreFile = (entry) => {
        if (entry === undefined) {
          this.loaded = true
          return
        }

        const fileName = entry.name
        const modName = /([a-z0-9]+)/i.exec(fileName)[0]
        const md5File = this.readZip.md5File(entry)

        LauncherLog.debug('Loading mod ' + fileName)
        const fileZip = new ReadZip(this.readZip.readFile(entry))
        const mcMod = fileZip.readAsText(path.normalize('./mcmod.info'))

        let mod = {
          fileMD5: md5File,
          modId: '',
          name: '',
          type: 'mods',
          side: 'both',
          version: '',
          mcVersion: '',
          authors: '',
          description: '',
          file: fileName
        }

        if (mcMod !== '') {
          try {
            let _mod = JSON.parse(mcMod)[0]
            if (_mod.modList !== undefined) {
              _mod = _mod.modList
            }

            mod = {
              fileMD5: md5File,
              modId: _mod.modid || '',
              name: _mod.name || '',
              side: 'both',
              type: _mod.modid.includes('api') ? 'coreMods' : 'mods',
              version: _mod.version || '',
              mcVersion: _mod.mcversion || '',
              description: _mod.description || '',
              file: fileName
            }
            if (_mod.authors !== undefined) {
              mod.authors = _mod.authors.join(', ')
            } else if (_mod.authorList !== undefined) {
              mod.authors = _mod.authorList.join(', ')
            } else {
              mod.authors = ''
            }
          } catch (_) {
            let match
            while ((match = _parseMcMod.exec(mcMod)) !== null) {
              // This is necessary to avoid infinite loops with zero-width matches
              if (match.index === match.lastIndex) {
                _parseMcMod.lastIndex++
              }

              let key = null
              let value = null
              // The result can be accessed through the `m`-variable.
              match.forEach((match, groupIndex) => {
                if (groupIndex === 1) {
                  if (match === 'authorList') {
                    match = 'authors'
                  } else if (match === 'modid') {
                    match = 'modId'
                  }

                  key = match
                } else if (groupIndex === 2) {
                  if (match.startsWith('"')) {
                    value = match.replace(/"/g, '')
                  } else if ((key === 'authors') || (key === 'authorList')) {
                    value = JSON.parse(match).join(', ')
                  } else {
                    value = JSON.parse(match)
                  }
                }
              })
              mod[key] = value
            }
          }

          if (mod.modId.length <= 0) {
            mod.modId = modName.replace(/ /, '')
          }
          if (mod.name.length <= 0) {
            mod.name = modName
          }

          mod.type = mod.modId.toUpperCase().includes('API') ? 'coreMods' : 'mods'
        } else {
          mod.modId = modName.replace(/ /, '')
          mod.name = modName
        }

        sioClient.emit('getMod', mod.modId, (srvMod) => {
          if (srvMod[0].length > 0) {
            srvMod = srvMod[0][0]
            mod.name = srvMod.name
            mod.version = srvMod.version
            mod.mcVersion = srvMod.mcVersion
            mod.description = srvMod.description
            mod.authors = srvMod.authors.join(', ')
          }

          LauncherLog.debug(mod.name + ' is loaded')
          this.$nextTick(function () {
            this.modPack.mods.push(mod)
            this.current++

            setTimeout(() => {
              exploreFile(modFiles.splice(0, 1)[0])
            }, 2)
          })
        })
      }

      setTimeout(() => {
        exploreFile(modFiles.splice(0, 1)[0])
      }, 100)
    },

    /**
     * Select the mod pack logo
     */
    selectMpLogo () {
      remote.dialog.showOpenDialog({
        title: Vue.t('components.mpEditor.selectMpLogo'),
        properties: ['openFile'],
        defaultPath: SettingsStore.getters.settings.general.installPath,
        filters: [{
          name: 'PNG Files',
          extensions: ['png']
        }]
      }, (filePaths) => {
        if (filePaths !== undefined) {
          LauncherLog.debug('Loading logo (' + filePaths[0] + ')')
          const img = new Image()
          img.onload = () => {
            if ((img.naturalWidth === 64) && (img.naturalHeight === 64)) {
              const fileReader = new FileReader()
              fileReader.onload = (event) => {
                this.modPack.logo = event.target.result

                this.mpLogo = filePaths[0]
                LauncherLog.debug('The logo "' + filePaths[0] + '" is loaded')
              }
              fileReader.onabort = fileReader.onerror = () => {
                LauncherLog.debug('The logo "' + filePaths[0] + '" can\'t read')
                Alert.dispatch('alert', {
                  type: 'error',
                  message: Vue.t('components.mpEditor.mpLogo_cantRead')
                })
              }
              fileReader.readAsArrayBuffer(fs.readFileSync(filePaths[0]))
            } else {
              LauncherLog.debug('The logo "' + filePaths[0] + '" not 64x64')
              Alert.dispatch('alert', {
                type: 'error',
                message: Vue.t('components.mpEditor.mpLogo_errorSize')
              })
            }
          }
          img.src = filePaths[0]
        }
      })
    }
  }
}
