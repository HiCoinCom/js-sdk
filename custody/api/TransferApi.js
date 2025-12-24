/**
 * Transfer API - Internal account transfer operations
 * Provides methods for transferring funds between merchant accounts
 * @class TransferApi
 * @extends BaseApi
 */
const BaseApi = require('./BaseApi');

class TransferApi extends BaseApi {
  /**
   * Creates a new TransferApi instance
   * @param {WaasConfig} config - WaaS configuration object
   */
  constructor(config) {
    super(config);
  }

  /**
   * Internal transfer between merchant accounts
   * @param {Object} params - Transfer parameters
   * @param {string} params.request_id - Unique request ID (merchant generated)
   * @param {string} params.symbol - Cryptocurrency symbol (e.g., 'BTC', 'ETH')
   * @param {string} params.amount - Transfer amount
   * @param {number} params.from - Source user ID
   * @param {number} params.to - Destination user ID
   * @returns {Promise<Object>} Transfer result
   * @example
   * const result = await transferApi.accountTransfer({
   *   request_id: 'transfer_001',
   *   symbol: 'USDT',
   *   amount: '100.5',
   *   from: 123,
   *   to: 456
   * });
   */
  async accountTransfer(params) {
    const response = await this.post('/transfer/transfer', params);
    return this.validateResponse(response);
  }

  /**
   * Gets transfer records by request IDs or WaaS IDs
   * @param {Object} params - Query parameters
   * @param {Array<string>} params.ids - List of request IDs or WaaS IDs
   * @param {string} params.ids_type - Type of IDs: 'request_ids' or 'waas_ids'
   * @returns {Promise<Array>} Transfer records
   * @example
   * const transfers = await transferApi.getAccountTransferList({
   *   ids: ['transfer_001', 'transfer_002'],
   *   ids_type: 'request_ids'
   * });
   */
  async getAccountTransferList(params) {
    const response = await this.post('/transfer/transferList', params);
    return this.validateResponse(response);
  }

  /**
   * Syncs transfer records by max ID (pagination)
   * @param {Object} params - Query parameters
   * @param {number} params.max_id - Maximum transaction ID for pagination
   * @returns {Promise<Array>} Synced transfer records
   * @example
   * const transfers = await transferApi.syncAccountTransferList({
   *   max_id: 1000
   * });
   */
  async syncAccountTransferList(params) {
    const response = await this.post('/transfer/syncTransferList', params);
    return this.validateResponse(response);
  }
}

module.exports = TransferApi;
