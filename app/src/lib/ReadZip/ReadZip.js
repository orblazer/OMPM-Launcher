/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 26/10/2016
 */
import path from 'path'
import AdmZip from 'adm-zip'
import crypto from 'crypto'

const _zipFile = Symbol('zipFile')
class ReadZip {
  /**
   * Initialize zip file
   * @param {String|Buffer} zipFile Path of zip file
   */
  constructor (zipFile) {
    if (!Buffer.isBuffer(zipFile) && !((typeof zipFile === 'string') && path.isAbsolute(zipFile))) {
      throw new TypeError('The path must be a buffer or string and absolute path.')
    }

    this[_zipFile] = new AdmZip(zipFile)
  }

  /**
   * Get entries of zip file
   * @return {Array} The entries of zip file
   */
  getEntries () {
    return this[_zipFile].getEntries()
  }

  /**
   * Get directories of zip files
   * @return {Array} The directories of zip file
   */
  getDirectories () {
    return this.getEntries().filter((entry) => entry.isDirectory)
  }

  /**
   * Get files of zip files
   * @param {RegExp} filter The regexp of filter for files
   * @return {Array} The files of zip file
   */
  getFiles (filter = /.*/) {
    return this.getEntries().filter((entry) => !entry.isDirectory && filter.test(entry.entryName))
  }

  /**
   * Read file buffer on archive
   * @param {Object} entry The entry of file
   * @return {Buffer}
   */
  readFile (entry) {
    return this[_zipFile].readFile(entry)
  }

  /**
   * Read file content on archive
   * @param {String} filePath Path on file in zip
   */
  readAsText (filePath) {
    return this[_zipFile].readAsText(path.normalize(filePath))
  }

  /**
   * Get MD5 of file
   * @param {Object} entry The entry of the file
   * @return {String} The MD5 of file
   */
  md5File (entry) {
    const hash = crypto.createHash('md5')
    hash.update(this.readFile(entry))
    return hash.digest('hex')
  }
}
export default ReadZip
