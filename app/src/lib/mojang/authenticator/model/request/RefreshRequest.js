/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 17/10/2016
 */
const _accessToken = Symbol('accessToken')
const _clientToken = Symbol('clientToken')
const _selectedProfile = Symbol('selectedProfile')

class RefreshRequest {
  /**
   * Initialize refresh request
   * @param {string} accessToken Access token
   * @param {string} clientToken Client token
   * @param {AuthProfile} selectedProfile Selected profile
   */
  constructor (accessToken, clientToken, selectedProfile) {
    // Access token
    this[_accessToken] = accessToken
    // Client token
    this[_clientToken] = clientToken
    // Selected token
    this[_selectedProfile] = selectedProfile
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
   * Get selected profile
   * @return {AuthProfile} selected profile
   */
  get selectedProfile () {
    return this[_selectedProfile]
  }

  /**
   * Convert the class to JSON
   * @return {Object} Property of class
   */
  toJSON () {
    const { accessToken, clientToken, selectedProfile } = this
    return { accessToken, clientToken, selectedProfile }
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
