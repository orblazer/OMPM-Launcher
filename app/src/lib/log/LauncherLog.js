/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 26/10/2016
 */
import fs from 'fs'
import path from 'path'

class LauncherLog {
  static get logFile () {
    return path.join('launcher.log')
  }

  static get _date () {
    function pad (number) {
      return (number < 10) ? '0' + number : number
    }

    const date = new Date(Date.now())
    /* return '[' + date.getUTCFullYear() + '-' + pad(date.getUTCMonth() + 1) + '-' + pad(date.getUTCDate()) +
     ' at ' +*/
    return '[' + pad(date.getUTCHours()) + ':' + pad(date.getUTCMinutes()) + ':' + pad(date.getUTCSeconds()) + ']'
  }

  static _formatData (...data) {
    let result = ''

    if ((data[0] instanceof Array) && !(data[0][0] instanceof Array)) {
      data = [data]
    }

    if (data[0][0] instanceof Array) {
      for (const dt of data[0][0]) {
        try {
          if (typeof dt === 'string') {
            result += String(dt) + ' '
          } else {
            result += JSON.stringify(dt) + ' '
          }
        } catch (_) {
          result += String(dt) + ' '
        }
      }
      return result.slice(0, result.length - 1)
    } else {
      console.log(data)
      return String(data)
    }
  }

  /**
   * Log data (Level: Info)
   * @param {*} data
   */
  static log (...data) {
    this.info(data)
  }

  /**
   * Log data (Level: info)
   * @param {*} data
   */
  static info (...data) {
    this._saveLog('INFO', data)
  }

  /**
   * Log data (Level: debug)
   * @param {*} data
   */
  static debug (...data) {
    if (require('../../../../config').debug) {
      this._saveLog('DEBUG', data)
    }
  }

  /**
   * Log data (Level: warn)
   * @param {*} data
   */
  static warn (...data) {
    this._saveLog('WARN', data)
  }

  /**
   * Log data (Level: error)
   * @param {*} data
   */
  static error (...data) {
    this._saveLog('ERROR', data)
  }

  /**
   * Save log
   * @param {String} level Level of log (info, debug, warn, error)
   * @param {*} data
   * @private
   */
  static _saveLog (level, data) {
    if (data[0].length <= 0) {
      throw new SyntaxError('You must pass a data')
    }

    console.log(this._date + ' [' + level.toUpperCase() + '] ' + this._formatData(data) + '\n')
    fs.appendFileSync(this.logFile, this._date + ' [' + level.toUpperCase() + '] ' + this._formatData(data) + '\n')
  }

  static clearLog () {
    fs.unlink(this.logFile, (err) => {
      if (err) {
        throw err
      }
    })
  }
}
export default LauncherLog
