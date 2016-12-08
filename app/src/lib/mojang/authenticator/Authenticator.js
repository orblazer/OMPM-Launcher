/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 17/10/2016
 */
import Request from './model/request/import'
import AuthError from './model/AuthError'
import AuthenticationException from './AuthenticationException'
import AuthResponse from './model/response/AuthResponse'
import RefreshResponse from './model/response/RefreshResponse'
import AuthProfile from './model/AuthProfile'

class Authenticator {
  /**
   * Mojang official auth server
   * @return {string}
   */
  static get MOJANG_AUTH_URL () {
    return 'https://authserver.mojang.com/'
  }

  /**
   * Create authenticator
   *
   * @param {string} authURL    Auth server
   * @param {AuthPoints} authPoints Auth points
   */
  constructor (authURL, authPoints) {
    // Auth server URL
    this._authURL = authURL
    // Server auth points
    this._authPoints = authPoints
  }

  /**
   * Authenticate
   *
   * @param {AuthAgent} agent    Agent
   * @param {string} username    Mojang username
   * @param {string} password    Mojang password
   * @param {string} clientToken Client token
   *
   * @return {Promise} Promise of auth response
   */
  authenticate (agent = null, username, password, clientToken = '') {
    const request = new Request.Auth(agent, Authenticator._trim(username), Authenticator._trim(password), Authenticator._trim(clientToken))
    return this._sendRequest(request, AuthResponse, this._authPoints.getAuthenticatePoint())
  }

  /**
   * Refresh authenticate (refresh access token)
   *
   * @param {string} accessToken Access token
   * @param {string} clientToken Client token
   * @param {AuthProfile} selectedProfile Selected profile
   *
   * @return {Promise} Promise of refresh response
   */
  refresh (accessToken, clientToken = '', selectedProfile = null) {
    const request = new Request.Refresh(Authenticator._trim(accessToken), Authenticator._trim(clientToken), selectedProfile)
    return this._sendRequest(request, RefreshResponse, this._authPoints.getRefreshPoint())
  }

  /**
   * Check if access token is valid
   *
   * @param {string} accessToken Access token
   * @param {string} clientToken Client token
   *
   * @return {Promise} Promise of validate access token
   */
  validate (accessToken, clientToken = '') {
    const request = new Request.Validate(Authenticator._trim(accessToken), Authenticator._trim(clientToken))
    return this._sendRequest(request, null, this._authPoints.getValidatePoint())
  }

  /**
   * Invalidates access token using an account's username and password
   *
   * @param {string} username Mojang username
   * @param {string} password Mojang password
   *
   * @return {Promise} Promise of invalidates access token
   */
  signout (username, password) {
    const request = new Request.Signout(Authenticator._trim(username), Authenticator._trim(password))
    return this._sendRequest(request, null, this._authPoints.getSignoutPoint())
  }

  /**
   * Invalidates accessTokens using a client/access token pair
   *
   * @param {string} accessToken Access token
   * @param {string} clientToken Client token
   *
   * @return {Promise} Promise of invalidates access token
   */
  invalidate (accessToken, clientToken = '') {
    const request = new Request.Invalidate(Authenticator._trim(accessToken), Authenticator._trim(clientToken))
    return this._sendRequest(request, null, this._authPoints.getInvalidatePoint())
  }

  /**
   * Send request to auth server
   *
   * @param {object} request   Request
   * @param {class} model     Model
   * @param {string} authPoint Auth point
   *
   * @return {Promise} Promise of response
   *
   * @throws AuthenticationException
   */
  _sendRequest (request, model, authPoint) {
    return new Promise((resolve, reject) => {
      Vue.http.post(this._authURL + authPoint, JSON.stringify(request)).then((response) => {
        if (response.statusText === 'No Content') {
          resolve()
          return
        }

        if (response.body.selectedProfile) {
          response.body.selectedProfile = new AuthProfile(...Object.values(response.body.selectedProfile))
        }
        if (response.body.availableProfiles) {
          response.body.availableProfiles.forEach((val, k) => {
            response.body.availableProfiles[k] = new AuthProfile(...Object.values(val))
          })
        }

        resolve(Reflect.construct(model, Object.values(response.body)))
      }).catch((response) => {
        if (response.body != null) {
          reject(new AuthenticationException(new AuthError(response.body.error, response.body.errorMessage, response.body.cause)))
        } else if (!(response instanceof Error)) {
          reject(new URIError('No Connection'))
        } else {
          reject(response)
        }
      })
    })
  }

  static _trim (str) {
    if (!str) return ''

    return str.replace(/^\s*|\s*$/g, '')
  }
}
export default Authenticator
