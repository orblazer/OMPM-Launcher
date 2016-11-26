/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 17/10/2016
 */
const _agent = Symbol('agent')
const _username = Symbol('username')
const _password = Symbol('password')
const _clientToken = Symbol('clientToken')

class AuthRequest {
  /**
   * Initialize auth request
   * @param {AuthAgent} agent Authentication agent (the game profile you want to use, Minecraft, Scrolls, etc...)
   * @param {string} username mojang username
   * @param {string} password mojang password
   * @param {string} clientToken Client token
   */
  constructor (agent = null, username, password, clientToken = '') {
    // Authentication agent (the game profile you want to use, Minecraft, Scrolls, etc...)
    this[_agent] = agent
    // Mojang username
    this[_username] = username
    // Mojang password
    this[_password] = password
    this[_clientToken] = clientToken
  }

  /**
   * Get authentication agent (the game profile you want to use, Minecraft, Scrolls, etc...)
   *
   * @return {AuthAgent} Authentication agent
   */
  get agent () {
    return this[_agent]
  }

  /**
   * Get mojang username
   * @return {string} mojang username
   */
  get username () {
    return this[_username]
  }

  /**
   * Get mojang password
   * @return {string} mojang password
   */
  get password () {
    return this[_password]
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
    const { agent, username, password, clientToken } = this
    return { agent, username, password, clientToken }
  }

  /**
   * Convert the JSON to class
   * @param {Object} obj The property of class
   * @return {AuthRequest}
   */
  static fromJSON (obj) {
    return new this(obj)
  }
}
export default AuthRequest
