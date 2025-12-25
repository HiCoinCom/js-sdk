/**
 * Account API - Account and balance management operations  
 * Provides methods for querying account balances and deposit addresses
 * @class AccountApi
 * @extends BaseApi
 */
const BaseApi = require('./BaseApi');

class AccountApi extends BaseApi {
  /**
   * Creates a new AccountApi instance
   * @param {WaasConfig} config - WaaS configuration object
   */
  constructor(config) {
    super(config);
  }

  /**
   * Gets user account balance for a specific cryptocurrency
   * @param {Object} params - Query parameters
   * @param {number} params.uid - User ID
   * @param {string} params.symbol - Cryptocurrency symbol (e.g., 'BTC', 'ETH')
   * @returns {Promise<Object>} Account balance information
   * @example
   * const account = await accountApi.getUserAccount({
   *   uid: 12345,
   *   symbol: 'BTC'
   * });
   */
  async getUserAccount(params) {
    const response = await this.post('/account/getByUidAndSymbol', params);
    return this.validateResponse(response);
  }

  /**
   * Gets user deposit address for a specific cryptocurrency
   * @param {Object} params - Query parameters
   * @param {number} params.uid - User ID
   * @param {string} params.symbol - Cryptocurrency symbol (e.g., 'BTC', 'ETH')
   * @returns {Promise<Object>} Deposit address information
   * @example
   * const address = await accountApi.getUserAddress({
   *   uid: 12345,
   *   symbol: 'ETH'
   * });
   */
  async getUserAddress(params) {
    const response = await this.post('/account/getDepositAddress', params);
    return this.validateResponse(response);
  }

  /**
   * Gets company (merchant) account balance for a specific cryptocurrency
   * @param {Object} params - Query parameters
   * @param {string} params.symbol - Cryptocurrency symbol (e.g., 'BTC', 'ETH')
   * @returns {Promise<Object>} Company account information
   * @example
   * const account = await accountApi.getCompanyAccount({
   *   symbol: 'ETH'
   * });
   */
  async getCompanyAccount(params) {
    const response = await this.post('/account/getCompanyBySymbol', params);
    return this.validateResponse(response);
  }

  /**
   * Gets user address information by address
   * @param {Object} params - Query parameters
   * @param {string} params.address - Blockchain address to query
   * @returns {Promise<Object>} Address details
   * @example
   * const info = await accountApi.getUserAddressInfo({
   *   address: '0x1234...'
   * });
   */
  async getUserAddressInfo(params) {
    const response = await this.post('/account/getDepositAddressInfo', params);
    return this.validateResponse(response);
  }
  /**
   * Syncs user address list by max ID (pagination)
   * @param {Object} params - Query parameters
   * @param {number} params.max_id - Maximum address ID for pagination (0 for first sync)
   * @returns {Promise<Array>} Synced user address list with id, uid, address, symbol
   * @example
   * const addresses = await accountApi.syncUserAddressList({
   *   max_id: 0
   * });
   */
  async syncUserAddressList(params) {
    const response = await this.post('/address/syncList', params);
    return this.validateResponse(response);
  }}

module.exports = AccountApi;
