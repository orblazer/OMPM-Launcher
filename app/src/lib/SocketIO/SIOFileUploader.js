/**
 * OMPM_launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 04/12/2016
 */
import EventListener from 'events'
import path from 'path'
import fs from 'fs'

const _socket = Symbol('socket')
const _uid = Symbol('uid')
const _uploadId = Symbol('uploadId')
const _option = Symbol('option')
const _uploadingFiles = Symbol('uploadingFiles')
const _fileData = Symbol('fileData')
class SIOFileUploader extends EventListener {
  constructor (socket) {
    super()
    this[_socket] = socket

    // Generate instance id
    if (global.SIOFU_instId === undefined) {
      global.SIOFU_instId = 0
    }
    this[_uid] = global.SIOFU_instId++ // using for identifying multiple file upload from SocketIOFileClient objects
    this[_uploadId] = 0 // using for identifying each uploading
    this[_option] = {}
    this[_uploadingFiles] = {}

    socket.once('siofu.recvSync', (option) => {
      this[_option] = option
    })
    socket.emit('siofu.reqSync')
  }

  /**
   * Upload the file
   * @param {string} file The absolute path of file
   * @param {object} option The options for file
   */
  upload (file, option = {}) {
    if (!path.isAbsolute(file)) {
      throw new SyntaxError('The path of "file" is not absolute path.')
    }

    // Get the state of file
    fs.stat(file, (err, stats) => {
      if (err) throw err
      let fileInfo = {
        id: this._genUploadId(),
        name: path.basename(file, '.zip'),
        ext: path.extname(file),
        uploadTo: option.uploadTo || '',
        size: stats.size,
        chunkSize: this[_option].chunkSize,
        sent: 0
      }

      // Get the content of file
      fs.readFile(file, (err, data) => {
        if (err) throw err
        this[_fileData] = data

        // check file mime type if exists
        if (this[_option].accepts && (this[_option].accepts.length > 0)) {
          if (this[_option].accepts.filter((accept) => accept === fileInfo.ext).length <= 0) {
            return super.emit('error', new Error('Not Acceptable file type ' + fileInfo.ext + ' of ' + fileInfo.name + '. Type must be one of these: ' + this[_option].accepts.join(', ')))
          }
        }

        // check file size
        if (this[_option].maxFileSize && (this[_option].maxFileSize > 0)) {
          if (fileInfo.size > this[_option].maxFileSize) {
            return self.emit('error', new Error('Max Uploading File size must be under ' + this[_option].maxFileSize + ' byte(s).'))
          }
        }

        // put into uploadingFiles list
        this[_uploadingFiles][fileInfo.id] = fileInfo

        // request the server to make a file
        super.emit('start', {
          name: fileInfo.name,
          size: fileInfo.size,
          uploadTo: fileInfo.uploadTo
        })
        this[_socket].emit('siofu.createFile', fileInfo)

        // register the listeners
        this[_socket].once('siofu.request::' + fileInfo.id, (srvFileSize, uploadSpeed) => this._sendChunk(fileInfo, srvFileSize, uploadSpeed))
        this[_socket].on('siofu.complete::' + fileInfo.id, (info) => {
          super.emit('complete', info)

          // Remove socket.io listeners
          this[_socket].removeAllListeners('siofu.abort::' + fileInfo.id)
          this[_socket].removeAllListeners('siofu.error::' + fileInfo.id)
          this[_socket].removeAllListeners('siofu.complete::' + fileInfo.id)

          // remove from uploadingFiles list
          delete this[_uploadingFiles][fileInfo.id]
        })
        this[_socket].on('siofu.abort::' + fileInfo.id, (info) => {
          fileInfo.aborted = true
          super.emit('abort', {
            name: fileInfo.name,
            size: fileInfo.size,
            sent: fileInfo.sent,
            wrote: info.wrote,
            uploadTo: fileInfo.aborted
          })
        })
        this[_socket].on('siofu.error::' + fileInfo.id, (err) => {
          super.emit('error', new Error(err.message))
        })
      })
    })
  }

  /**
   * Abort the upload
   * @param {number} id The upload id
   */
  abort (id) {
    this[_socket].emit('siofu.abort::' + id)
  }

  /**
   * Destroy the SIOFileUploader
   */
  destroy () {
    Object.values(this[_uploadingFiles]).forEach((uploadingFile) => this.abort(uploadingFile.id))

    this[_socket] = this[_uploadingFiles] = null
  }

  /**
   * Generate the upload id
   * @return {string} The upload id
   * @private
   */
  _genUploadId () {
    return 'u_' + this[_uploadId]++
  }

  /**
   * Send the chunk
   * @param {object} fileInfo The file info
   * @param {number} srvFileSize The size of file uploaded (on server)
   * @param {number} uploadSpeed The upload speed
   * @private
   */
  _sendChunk (fileInfo, srvFileSize, uploadSpeed) {
    if (fileInfo.aborted) return
    if (fileInfo.sent > this[_fileData].length) {
      this[_socket].emit('siofu.done::' + fileInfo.id)
      return
    }

    const chunk = this[_fileData].slice(fileInfo.sent, fileInfo.sent + fileInfo.chunkSize)
    fileInfo.sent += chunk.length
    this[_uploadingFiles][fileInfo.id] = fileInfo

    super.emit('stream', {
      name: fileInfo.name,
      size: fileInfo.size,
      sent: fileInfo.sent,
      uploadTo: fileInfo.uploadTo
    }, srvFileSize, uploadSpeed)
    this[_socket].once('siofu.request::' + fileInfo.id, (srvFileSize, uploadSpeed) => this._sendChunk(fileInfo, srvFileSize, uploadSpeed))
    this[_socket].emit('siofu.stream::' + fileInfo.id, chunk)
  }
}
export default SIOFileUploader
