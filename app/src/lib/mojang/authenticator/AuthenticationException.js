/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 17/10/2016
 */
class AuthenticationException extends Error {
  /**
   * Generate exception
   * @param {AuthError} model JSON model instance of error
   */
  constructor (model) {
    super(model.getErrorMessage())
    this.name = model.getError()

    // JSON model instance of error
    this._model = model
  }

  /**
   * Get error model
   * @return {AuthError} JSON model instance of error
   */
  getErrorModel () {
    return this._model
  }
}
export default AuthenticationException
