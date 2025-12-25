/**
 * User API - User management and registration operations
 * Provides methods for user registration, information retrieval, and coin list queries
 * @class UserApi
 * @extends BaseApi
 */
const BaseApi = require('./BaseApi');

class UserApi extends BaseApi {
  /**
   * Creates a new UserApi instance
   * @param {WaasConfig} config - WaaS configuration object
   */
  constructor(config) {
    super(config);
  }

  /**
   * Registers a new user using mobile phone
   * @param {Object} params - Registration parameters
   * @param {string} params.country - Country code (e.g., '86')
   * @param {string} params.mobile - Mobile phone number
   * @returns {Promise<Object>} User registration result containing uid
   * @example
   * const result = await userApi.registerMobileUser({
   *   country: '86',
   *   mobile: '13800000000'
   * });
   */
  async registerMobileUser(params) {
    const response = await this.post('/user/createUser', params);
    return this.validateResponse(response);
  }

  /**
   * Registers a new user using email
   * @param {Object} params - Registration parameters
   * @param {string} params.email - Email address
   * @returns {Promise<Object>} User registration result containing uid
   * @example
   * const result = await userApi.registerEmailUser({
   *   email: 'user@example.com'
   * });
   */
  async registerEmailUser(params) {
    const response = await this.post('/user/registerEmail', params);
    return this.validateResponse(response);
  }

  /**
   * Gets user information by mobile phone
   * @param {Object} params - Query parameters
   * @param {string} params.country - Country code (e.g., '86')
   * @param {string} params.mobile - Mobile phone number
   * @returns {Promise<Object>} User information
   * @example
   * const userInfo = await userApi.getMobileUser({
   *   country: '86',
   *   mobile: '13800000000'
   * });
   */
  async getMobileUser(params) {
    const response = await this.post('/user/info', params);
    return this.validateResponse(response);
  }

  /**
   * Gets user information by email
   * @param {Object} params - Query parameters
   * @param {string} params.email - User email
   * @returns {Promise<Object>} User information
   * @example
   * const userInfo = await userApi.getEmailUser({
   *   email: 'user@example.com'
   * });
   */
  async getEmailUser(params) {
    const response = await this.post('/user/info', params);
    return this.validateResponse(response);
  }
}

module.exports = UserApi;
