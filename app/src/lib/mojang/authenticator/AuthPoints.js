/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 17/10/2016
 */
class AuthPoints {
  static get NORMAL_AUTH_POINTS () {
    return new AuthPoints('authenticate', 'refresh', 'validate', 'signout', 'invalidate')
  }

  /**
   * Initialize auth points
   *
   * @param {string} authenticatePoint Authenticate point
   * @param {string} refreshPoint      Refresh point
   * @param {string} validatePoint     Validate point
   * @param {string} signoutPoint      Sign this._out point
   * @param {string} invalidatePoint   Invalidate point
   */
  constructor (authenticatePoint, refreshPoint, validatePoint, signoutPoint, invalidatePoint) {
    // Authenticate point
    this._authenticatePoint = authenticatePoint
    // Refresh point
    this._refreshPoint = refreshPoint
    // Validate point
    this._validatePoint = validatePoint
    // Sign this._out point
    this._signoutPoint = signoutPoint
    // Invalidate point
    this._invalidatePoint = invalidatePoint
  }

  /**
   * Get authenticate point
   *
   * @return {string} authenticate point
   */
  getAuthenticatePoint () {
    return this._authenticatePoint
  }

  /**
   * Get refresh point
   *
   * @return {string} refresh point
   */
  getRefreshPoint () {
    return this._refreshPoint
  }

  /**
   * Get validate point
   *
   * @return {string} validate point
   */
  getValidatePoint () {
    return this._validatePoint
  }

  /**
   * Get sign this._out point
   *
   * @return {string} sign this._out point
   */
  getSignoutPoint () {
    return this._signoutPoint
  }

  /**
   * Get invalidate point
   *
   * @return {string} invalidate point
   */
  getInvalidatePoint () {
    return this._invalidatePoint
  }
}
export default AuthPoints
