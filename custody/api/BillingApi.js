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
   * @param {Object} params - Withdrawal parameters (WithdrawArgs)
   * @param {string} params.request_id - Unique request ID (merchant generated)
   * @param {number} params.from_uid - Source user ID
   * @param {string} params.to_address - Destination address or (address_memo) for some coins
   * @param {string} params.amount - Withdrawal amount
   * @param {string} params.symbol - Cryptocurrency symbol (e.g., 'BTC', 'ETH')
   * @returns {Promise<Object>} Withdrawal result
   * @example
   * const result = await billingApi.withdraw({
   *   request_id: 'withdraw_001',
   *   from_uid: 12345,
   *   to_address: '0x1234...',
   *   amount: '1.5',
   *   symbol: 'ETH'
   * });
   */
  async withdraw(params) {
    const response = await this.post('/billing/withdraw', params);
    return this.validateResponse(response);
  }

  /**
   * Gets withdrawal records by request IDs
   * @param {Object} params - Query parameters
   * @param {string} [params.ids] - Comma-separated list of request IDs
   * @param {Array<string>} [params.request_id_list] - List of request IDs (will be converted to ids)
   * @returns {Promise<Array>} Withdrawal records
   * @example
   * // New format (recommended)
   * const withdrawals = await billingApi.withdrawList({
   *   ids: 'withdraw_001,withdraw_002'
   * });
   * // Legacy format (auto-converted)
   * const withdrawals = await billingApi.withdrawList({
   *   request_id_list: ['withdraw_001', 'withdraw_002']
   * });
   */
  async withdrawList(params) {
    // Convert array format to string format for backward compatibility
    if (params.request_id_list && !params.ids) {
      params = { ...params, ids: params.request_id_list.join(',') };
      delete params.request_id_list;
    }
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
   * @param {string} [params.ids] - Comma-separated list of WaaS deposit IDs
   * @param {Array<number>} [params.waas_id_list] - List of WaaS deposit IDs (will be converted to ids)
   * @returns {Promise<Array>} Deposit records
   * @example
   * // New format (recommended)
   * const deposits = await billingApi.depositList({
   *   ids: '123,456'
   * });
   * // Legacy format (auto-converted)
   * const deposits = await billingApi.depositList({
   *   waas_id_list: [123, 456]
   * });
   */
  async depositList(params) {
    // Convert array format to string format for backward compatibility
    if (params.waas_id_list && !params.ids) {
      params = { ...params, ids: params.waas_id_list.join(',') };
      delete params.waas_id_list;
    }
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
   * @param {string} [params.ids] - Comma-separated list of WaaS transaction IDs
   * @param {Array<number>} [params.waas_id_list] - List of WaaS transaction IDs (will be converted to ids)
   * @returns {Promise<Array>} Miner fee records
   * @example
   * // New format (recommended)
   * const fees = await billingApi.minerFeeList({
   *   ids: '123,456'
   * });
   * // Legacy format (auto-converted)
   * const fees = await billingApi.minerFeeList({
   *   waas_id_list: [123, 456]
   * });
   */
  async minerFeeList(params) {
    // Convert array format to string format for backward compatibility
    if (params.waas_id_list && !params.ids) {
      params = { ...params, ids: params.waas_id_list.join(',') };
      delete params.waas_id_list;
    }
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
