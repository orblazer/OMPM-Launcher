/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 17/10/2016
 */
const _username = Symbol('username')
const _password = Symbol('password')

class SignoutRequest {
  /**
   * Initialize signout request
   * @param {string} username mojang username
   * @param {string} password mojang password
   */
  constructor (username, password) {
    // Mojang username
    this[_username] = username
    // Mojang password
    this[_password] = password
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
   * Convert the class to JSON
   * @return {Object} Property of class
   */
  toJSON () {
    const { username, password } = this
    return { username, password }
  }

  /**
   * Convert the JSON to class
   * @param {Object} obj The property of class
   * @return {SignoutRequest}
   */
  static fromJSON (obj) {
    return new this(obj)
  }
}
export default SignoutRequest
