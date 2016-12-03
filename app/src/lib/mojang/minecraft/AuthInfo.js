/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 17/10/2016
 */
const _username = Symbol('username')
const _accessToken = Symbol('accessToken')
const _clientToken = Symbol('clientToken')
const _uuid = Symbol('uuid')

class AuthInfo {
  /**
   * Initialize auth info
   * @param {string} username Player name
   * @param {string} accessToken Access token
   * @param {string} clientToken Client token
   * @param {string} uuid UUID of player
   */
  constructor (username, accessToken, clientToken, uuid) {
    this[_username] = username
    this[_accessToken] = accessToken
    this[_clientToken] = clientToken
    this[_uuid] = uuid
  }

  /**
   * Get player name
   * @return {string} player name
   */
  get username () {
    return this[_username]
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
   * Get UUID of player
   * @return {string} UUID of player
   */
  get UUID () {
    return this[_uuid]
  }

  /**
   * Convert the class to JSON
   * @return {Object} Property of class
   */
  toJSON () {
    const { username, accessToken, clientToken, UUID } = this
    return { username, accessToken, clientToken, UUID }
  }

  /**
   * Convert the JSON to class
   * @param {Object} obj The property of class
   * @return {AuthInfo}
   */
  static fromJSON (obj) {
    return new this(obj)
  }
}
export default AuthInfo
