/**
 * Deposit API - MPC deposit management operations
 * Provides methods for querying deposit records
 * @class DepositApi
 * @extends MpcBaseApi
 */
const MpcBaseApi = require('./MpcBaseApi');

class DepositApi extends MpcBaseApi {
  /**
   * Creates a new DepositApi instance
   * @param {MpcConfig} config - MPC configuration object
   */
  constructor(config) {
    super(config);
  }

  /**
   * Gets receiving records
   * Get all wallet receiving records under the workspace, and return up to 100 records
   * @param {Object} params - Query parameters
   * @param {Array<number>} params.ids - Receiving IDs (up to 100)
   * @returns {Promise<Object>} Deposit records
   * @example
   * const deposits = await depositApi.getDepositRecords({
   *   ids: [123, 456, 789]
   * });
   */
  async getDepositRecords(params) {
    if (!params.ids || !Array.isArray(params.ids) || params.ids.length === 0) {
      throw new Error('Parameter "ids" is required and must be a non-empty array');
    }

    const response = await this.get('/api/mpc/billing/deposit_list', {
      ids: params.ids.join(',')
    });
    return this.validateResponse(response);
  }

  /**
   * Synchronizes transfer(deposit) records
   * Get all wallet receiving records under the workspace
   * @param {Object} params - Query parameters
   * @param {number} [params.max_id=0] - Receiving record initial ID
   * @returns {Promise<Object>} Synchronized deposit records
   * @example
   * const deposits = await depositApi.syncDepositRecords({ max_id: 0 });
   */
  async syncDepositRecords(params = {}) {
    const response = await this.get('/api/mpc/billing/sync_deposit_list', {
      max_id: params.max_id || 0
    });
    return this.validateResponse(response);
  }
}

module.exports = DepositApi;
