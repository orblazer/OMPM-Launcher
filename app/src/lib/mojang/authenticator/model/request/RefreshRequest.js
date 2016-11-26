/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 17/10/2016
 */
const _accessToken = Symbol('accessToken')
const _clientToken = Symbol('clientToken')

class RefreshRequest {
  /**
   * Initialize refresh request
   * @param {string} accessToken Access token
   * @param {string} clientToken Client token
   */
  constructor (accessToken, clientToken) {
    // Access token
    this[_accessToken] = accessToken
    // Client token
    this[_clientToken] = clientToken
  }

  /**
   * Get access token
   * @return {string} access token
   */
  get accessToken () {
    return this[_accessToken]
  }

  /**
   * Get client token
   * @return {string} client token
   */
  get clientToken () {
    return this[_clientToken]
  }

  /**
   * Convert the class to JSON
   * @return {Object} Property of class
   */
  toJSON () {
    const { accessToken, clientToken } = this
    return { accessToken, clientToken }
  }

  /**
   * Convert the JSON to class
   * @param {Object} obj The property of class
   * @return {RefreshRequest}
   */
  static fromJSON (obj) {
    return new this(obj)
  }
}
export default RefreshRequest
