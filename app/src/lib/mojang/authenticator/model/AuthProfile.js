/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 17/10/2016
 */
const _id = Symbol('id')
const _name = Symbol('name')

class AuthProfile {
  /**
   * Initialize auth profile
   *
   * @param {string} id   Profile UUID
   * @param {string} name Profile name
   */
  constructor (id = '', name = '') {
    // Profile UUID
    this[_id] = id
    // Profile name
    this[_name] = name
  }

  /**
   * Get profile UUID
   *
   * @return {string} profile UUID
   */
  get id () {
    return this[_id]
  }

  /**
   * Get profile name
   *
   * @return {string} profile name
   */
  get name () {
    return this[_name]
  }

  /**
   * Convert the class to JSON
   * @return {Object} Property of class
   */
  toJSON () {
    const { id, name } = this
    return { id, name }
  }

  /**
   * Convert the JSON to class
   * @param {Object} obj The property of class
   * @return {AuthProfile}
   */
  static fromJSON (obj) {
    return new this(obj)
  }
}
export default AuthProfile
