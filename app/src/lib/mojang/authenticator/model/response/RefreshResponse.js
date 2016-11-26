/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 17/10/2016
 */
const _accessToken = Symbol('accessToken')
const _clientToken = Symbol('clientToken')
const _selectedProfile = Symbol('selectedProfile')

class RefreshResponse {
  /**
   * Initialize refresh response
   *
   * @param {string} accessToken       Access token
   * @param {string} clientToken       Client token
   * @param {AuthProfile} selectedProfile   Current profile
   */
  constructor (accessToken, clientToken, selectedProfile) {
    // Access token
    this[_accessToken] = accessToken
    // Client token
    this[_clientToken] = clientToken
    // Current profile
    this[_selectedProfile] = selectedProfile
  }

  /**
   * Get access token
   *
   * @return {string} access token
   */
  get accessToken () {
    return this[_accessToken]
  }

  /**
   * Get client token
   *
   * @return {string} client token
   */
  get clientToken () {
    return this[_clientToken]
  }

  /**
   * Get current profile
   *
   * @return {AuthProfile} current profile
   */
  get selectedProfile () {
    return this[_selectedProfile]
  }
}
export default RefreshResponse
