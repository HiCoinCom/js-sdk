/**
 * Billing API - Deposit, withdrawal and miner fee operations
 * Provides methods for withdraw requests and querying deposit/withdrawal records
 * @class BillingApi
 * @extends BaseApi
 */
const BaseApi = require('./BaseApi');

class BillingApi extends BaseApi {
  /**
   * Creates a new BillingApi instance
   * @param {WaasConfig} config - WaaS configuration object
   */
  constructor(config) {
    super(config);
  }

  /**
   * Creates a withdrawal request
   * @param {Object} params - Withdrawal parameters
   * @param {string} params.request_id - Unique request ID (merchant generated)
   * @param {string} params.symbol - Cryptocurrency symbol (e.g., 'BTC', 'ETH')
   * @param {string} params.amount - Withdrawal amount
   * @param {string} params.address - Destination address
   * @param {string} [params.memo] - Address memo/tag (for coins like XRP, EOS)
   * @param {string} [params.remark] - Additional remark
   * @returns {Promise<Object>} Withdrawal result
   * @example
   * const result = await billingApi.withdraw({
   *   request_id: 'withdraw_001',
   *   symbol: 'ETH',
   *   amount: '1.5',
   *   address: '0x1234...'
   * });
   */
  async withdraw(params) {
    const response = await this.post('/billing/withdraw', params);
    return this.validateResponse(response);
  }

  /**
   * Gets withdrawal records by request IDs
   * @param {Object} params - Query parameters
   * @param {Array<string>} params.request_id_list - List of request IDs
   * @returns {Promise<Array>} Withdrawal records
   * @example
   * const withdrawals = await billingApi.withdrawList({
   *   request_id_list: ['withdraw_001', 'withdraw_002']
   * });
   */
  async withdrawList(params) {
    const response = await this.post('/billing/withdrawList', params);
    return this.validateResponse(response);
  }

  /**
   * Syncs withdrawal records by max ID (pagination)
   * @param {Object} params - Query parameters
   * @param {number} params.max_id - Maximum transaction ID for pagination
   * @returns {Promise<Array>} Synced withdrawal records
   * @example
   * const withdrawals = await billingApi.syncWithdrawList({
   *   max_id: 1000
   * });
   */
  async syncWithdrawList(params) {
    const response = await this.post('/billing/syncWithdrawList', params);
    return this.validateResponse(response);
  }

  /**
   * Gets deposit records by WaaS IDs
   * @param {Object} params - Query parameters
   * @param {Array<string>} params.waas_id_list - List of WaaS deposit IDs
   * @returns {Promise<Array>} Deposit records
   * @example
   * const deposits = await billingApi.depositList({
   *   waas_id_list: ['123', '456']
   * });
   */
  async depositList(params) {
    const response = await this.post('/billing/depositList', params);
    return this.validateResponse(response);
  }

  /**
   * Syncs deposit records by max ID (pagination)
   * @param {Object} params - Query parameters
   * @param {number} params.max_id - Maximum transaction ID for pagination
   * @returns {Promise<Array>} Synced deposit records
   * @example
   * const deposits = await billingApi.syncDepositList({
   *   max_id: 1000
   * });
   */
  async syncDepositList(params) {
    const response = await this.post('/billing/syncDepositList', params);
    return this.validateResponse(response);
  }

  /**
   * Gets miner fee records by WaaS IDs
   * @param {Object} params - Query parameters
   * @param {Array<string>} params.waas_id_list - List of WaaS transaction IDs
   * @returns {Promise<Array>} Miner fee records
   * @example
   * const fees = await billingApi.minerFeeList({
   *   waas_id_list: ['123', '456']
   * });
   */
  async minerFeeList(params) {
    const response = await this.post('/billing/minerFeeList', params);
    return this.validateResponse(response);
  }

  /**
   * Syncs miner fee records by max ID (pagination)
   * @param {Object} params - Query parameters
   * @param {number} params.max_id - Maximum transaction ID for pagination
   * @returns {Promise<Array>} Synced miner fee records
   * @example
   * const fees = await billingApi.syncMinerFeeList({
   *   max_id: 1000
   * });
   */
  async syncMinerFeeList(params) {
    const response = await this.post('/billing/syncMinerFeeList', params);
    return this.validateResponse(response);
  }
}

module.exports = BillingApi;
