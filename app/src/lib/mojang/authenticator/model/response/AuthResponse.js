/**
 * FTN Launcher.
 *
 * @author orblazer <orblazer@relonar.fr>
 * @created 17/10/2016
 */
const _accessToken = Symbol('accessToken')
const _clientToken = Symbol('clientToken')
const _selectedProfile = Symbol('selectedProfile')
const _availableProfiles = Symbol('availableProfiles')

class AuthResponse {
  /**
   * Initialize auth response
   *
   * @param {string} accessToken       Access token
   * @param {string} clientToken       Client token
   * @param {AuthProfile} selectedProfile   Current profile
   * @param {AuthProfile[]} availableProfiles Available profiles
   */
  constructor (accessToken, clientToken, selectedProfile, availableProfiles) {
    // Access token
    this[_accessToken] = accessToken
    // Client token
    this[_clientToken] = clientToken
    // Current profile
    this[_selectedProfile] = selectedProfile
    // Available profiles
    this[_availableProfiles] = availableProfiles
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

  /**
   * Get available profiles
   *
   * @return {AuthProfile[]} available profiles
   */
  get availableProfiles () {
    return this[_availableProfiles]
  }
}
export default AuthResponse
