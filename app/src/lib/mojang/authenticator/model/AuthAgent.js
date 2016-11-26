/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 17/10/2016
 */
const _name = Symbol('name')
const _version = Symbol('version')

class AuthAgent {
  // Minecraft auth agent
  static get MINECRAFT () {
    return new AuthAgent('Minecraft', 1)
  }

  // Scroll auth agent
  static get SCROLLS () {
    return new AuthAgent('Scrolls', 1)
  }

  /**
   * Initialize auth agent
   *
   * @param {string} name    Agent name
   * @param {number} version Agent version
   */
  constructor (name, version) {
    // Agent name
    this[_name] = name
    // Agent version
    this[_version] = version
  }

  /**
   * Get name of agent
   *
   * @return {string} name of agent
   */
  get name () {
    return this[_name]
  }

  /**
   * Get version of agent
   *
   * @return {number} version of agent
   */
  get version () {
    return this[_version]
  }

  /**
   * Convert the class to JSON
   * @return {Object} Property of class
   */
  toJSON () {
    const { name, version } = this
    return { name, version }
  }

  /**
   * Convert the JSON to class
   * @param {Object} obj The property of class
   * @return {AuthAgent}
   */
  static fromJSON (obj) {
    return new this(obj)
  }
}
export default AuthAgent
