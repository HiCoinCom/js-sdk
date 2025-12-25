/**
 * Transfer API - Internal account transfer operations
 * Provides methods for transferring funds between merchant accounts
 * @class TransferApi
 * @extends BaseApi
 */
const BaseApi = require('./BaseApi');

class TransferApi extends BaseApi {
  // Query type constants
  static REQUEST_ID = 'request_id';
  static RECEIPT = 'receipt';
  /**
   * Creates a new TransferApi instance
   * @param {WaasConfig} config - WaaS configuration object
   */
  constructor(config) {
    super(config);
  }

  /**
   * Internal transfer between merchant accounts
   * @param {Object} params - Transfer parameters (TransferArgs)
   * @param {string} params.request_id - Unique request ID (merchant generated)
   * @param {string} params.symbol - Cryptocurrency symbol (e.g., 'BTC', 'ETH')
   * @param {string} params.amount - Transfer amount
   * @param {string} params.from - Source user ID (as string)
   * @param {string} params.to - Destination user ID (as string)
   * @param {string} [params.remark] - Transfer remark
   * @returns {Promise<Object>} Transfer result
   * @example
   * const result = await transferApi.accountTransfer({
   *   request_id: 'transfer_001',
   *   symbol: 'USDT',
   *   amount: '100.5',
   *   from: '123',
   *   to: '456',
   *   remark: 'Internal transfer'
   * });
   */
  async accountTransfer(params) {
    const response = await this.post('/account/transfer', params);
    return this.validateResponse(response);
  }

  /**
   * Gets transfer records by request IDs or receipts
   * @param {Object} params - Query parameters
   * @param {string} params.ids - Comma-separated list of IDs to query
   * @param {string} params.ids_type - Type of IDs: TransferApi.REQUEST_ID or TransferApi.RECEIPT
   * @returns {Promise<Array>} Transfer records
   * @example
   * const transfers = await transferApi.getAccountTransferList({
   *   ids: 'transfer_001,transfer_002',
   *   ids_type: TransferApi.REQUEST_ID
   * });
   */
  async getAccountTransferList(params) {
    const response = await this.post('/account/transferList', params);
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
    const response = await this.post('/account/syncTransferList', params);
    return this.validateResponse(response);
  }
}

module.exports = TransferApi;
