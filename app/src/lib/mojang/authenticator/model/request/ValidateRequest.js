/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 17/10/2016
 */
const _accessToken = Symbol('accessToken')

class ValidateRequest {
  /**
   * Initialize validate request
   * @param {string} accessToken Access token
   */
  constructor (accessToken) {
    // Access token
    this[_accessToken] = accessToken
  }

  /**
   * Get access token
   * @return {string} access token
   */
  get accessToken () {
    return this[_accessToken]
  }

  /**
   * Convert the class to JSON
   * @return {Object} Property of class
   */
  toJSON () {
    const { accessToken } = this
    return { accessToken }
  }

  /**
   * Convert the JSON to class
   * @param {Object} obj The property of class
   * @return {ValidateRequest}
   */
  static fromJSON (obj) {
    return new this(obj)
  }
}
export default ValidateRequest
