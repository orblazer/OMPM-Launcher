/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 17/10/2016
 */
class AuthError {
  /**
   * Initialize auth error
   *
   * @param {string} error        Description of error
   * @param {string} errorMessage Long description of error
   * @param {string} cause        Cause of error
   */
  constructor (error, errorMessage, cause = '') {
    // Description of error
    this._error = error
    // Long description of error
    this._errorMessage = errorMessage
    // Cause of error
    this._cause = cause
  }

  /**
   * Get description of error
   *
   * @return {string} description of error
   */
  getError () {
    return this._error
  }

  /**
   * Get long description of error
   *
   * @return {string} long description of error
   */
  getErrorMessage () {
    return this._errorMessage
  }

  /**
   * Get cause of error
   *
   * @return {string} cause of error
   */
  getCause () {
    return this._cause
  }
}
export default AuthError
