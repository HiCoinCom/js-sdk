/**
 * Tron Resource API - TRON resource delegation operations
 * Provides methods for buying and querying TRON network resources (Energy/Bandwidth)
 * Matches Java SDK ITronBuyResourceApi interface
 * @class TronResourceApi
 * @extends MpcBaseApi
 */
const MpcBaseApi = require('./MpcBaseApi');

class TronResourceApi extends MpcBaseApi {
  /**
   * Creates a new TronResourceApi instance
   * @param {MpcConfig} config - MPC configuration object
   */
  constructor(config) {
    super(config);
  }

  /**
   * Creates delegate (Buy Tron Resource)
   * Purchase TRON network energy or bandwidth for a specific address
   * Matches Java SDK: ITronBuyResourceApi.createTronDelegate()
   * @param {Object} params - Delegation parameters (TronBuyResourceArgs)
   * @param {string} params.request_id - Unique request ID (required)
   * @param {number} [params.buy_type] - Buy type
   * @param {number} [params.resource_type] - Resource type: 0 for energy, 1 for bandwidth
   * @param {string} params.service_charge_type - Service charge type (required)
   * @param {number} [params.energy_num] - Energy amount to purchase
   * @param {number} [params.net_num] - Bandwidth amount to purchase
   * @param {string} params.address_from - Address paying for resources (required)
   * @param {string} [params.address_to] - Address to receive resources
   * @param {string} [params.contract_address] - Contract address
   * @returns {Promise<Object>} Delegation result with trans_id
   * @example
   * const result = await tronResourceApi.createTronDelegate({
   *   request_id: 'unique-id',
   *   resource_type: 0,
   *   buy_type: 0,
   *   address_from: 'TXxxx...',
   *   address_to: 'TRxxx...',
   *   contract_address: 'TEDxxx...',
   *   service_charge_type: '10010'
   * });
   */
  async createTronDelegate(params) {
    if (!params.request_id) {
      throw new Error('Required parameter: request_id');
    }
    if (!params.address_from) {
      throw new Error('Required parameter: address_from');
    }
    if (!params.service_charge_type) {
      throw new Error('Required parameter: service_charge_type');
    }

    const response = await this.post('/api/mpc/tron/delegate', params);
    return this.validateResponse(response);
  }

  /**
   * Gets buy resource records
   * Get delegation records by request IDs
   * Matches Java SDK: ITronBuyResourceApi.getBuyResourceRecords()
   * @param {Array<string>} requestIds - Request IDs array (up to 100)
   * @returns {Promise<Object>} Delegation records
   * @example
   * const records = await tronResourceApi.getBuyResourceRecords(['req-1', 'req-2']);
   */
  async getBuyResourceRecords(requestIds) {
    if (!requestIds || !Array.isArray(requestIds) || requestIds.length === 0) {
      throw new Error('Parameter "requestIds" is required and must be a non-empty array');
    }

    // Java SDK uses "ids" parameter with comma-separated string
    const response = await this.post('/api/mpc/tron/delegate/trans_list', {
      ids: requestIds.join(',')
    });
    return this.validateResponse(response);
  }

  /**
   * Synchronizes buy resource records
   * Get all delegation records, maximum of 100 records
   * Matches Java SDK: ITronBuyResourceApi.syncBuyResourceRecords()
   * @param {number} [maxId=0] - Starting ID of delegation records
   * @returns {Promise<Object>} Synchronized delegation records
   * @example
   * const records = await tronResourceApi.syncBuyResourceRecords(0);
   */
  async syncBuyResourceRecords(maxId = 0) {
    const response = await this.post('/api/mpc/tron/delegate/sync_trans_list', {
      max_id: maxId || 0
    });
    return this.validateResponse(response);
  }
}

module.exports = TronResourceApi;
