/**
 * Auto Sweep API - MPC auto-sweep management operations
 * Provides methods for configuring and querying auto-sweep operations
 * @class AutoSweepApi
 * @extends MpcBaseApi
 */
const MpcBaseApi = require('./MpcBaseApi');

class AutoSweepApi extends MpcBaseApi {
  /**
   * Creates a new AutoSweepApi instance
   * @param {MpcConfig} config - MPC configuration object
   */
  constructor(config) {
    super(config);
  }

  /**
   * Gets auto-sweep wallets
   * Retrieve the auto-sweep wallet and auto fueling wallet for a specific coin
   * @param {Object} params - Query parameters
   * @param {string} params.symbol - Unique identifier for the coin (e.g., "USDTERC20")
   * @returns {Promise<Object>} Auto-sweep wallet information
   * @example
   * const wallets = await autoSweepApi.autoCollectSubWallets({
   *   symbol: 'USDTERC20'
   * });
   */
  async autoCollectSubWallets(params) {
    if (!params.symbol) {
      throw new Error('Parameter "symbol" is required');
    }

    const response = await this.get('/api/mpc/auto_collect/sub_wallets', {
      symbol: params.symbol
    });
    return this.validateResponse(response);
  }

  /**
   * Configures auto-sweep for coin
   * Set the minimum auto-sweep amount and the maximum miner fee for refueling
   * @param {Object} params - Configuration parameters
   * @param {string} params.symbol - Unique identifier for the coin (e.g., "USDTERC20")
   * @param {string} params.collect_min - Minimum amount for auto-sweep (up to 6 decimal places)
   * @param {string} params.fueling_limit - Maximum miner fee amount for auto-sweep (up to 6 decimal places)
   * @returns {Promise<Object>} Configuration result
   * @example
   * const result = await autoSweepApi.setAutoCollectSymbol({
   *   symbol: 'USDTERC20',
   *   collect_min: '100',
   *   fueling_limit: '0.01'
   * });
   */
  async setAutoCollectSymbol(params) {
    if (!params.symbol || !params.collect_min || !params.fueling_limit) {
      throw new Error('Required parameters: symbol, collect_min, fueling_limit');
    }

    const response = await this.post('/api/mpc/auto_collect/symbol/set', {
      symbol: params.symbol,
      collect_min: params.collect_min,
      fueling_limit: params.fueling_limit
    });
    return this.validateResponse(response);
  }

  /**
   * Synchronizes auto sweeping records
   * Retrieve up to 100 sweeping records for all wallets under a workspace
   * @param {Object} params - Query parameters
   * @param {number} [params.max_id=0] - Starting ID for sweeping records
   * @returns {Promise<Object>} Synchronized auto-sweep records
   * @example
   * const records = await autoSweepApi.syncAutoCollectRecords({ max_id: 0 });
   */
  async syncAutoCollectRecords(params = {}) {
    const response = await this.get('/api/mpc/billing/sync_auto_collect_list', {
      max_id: params.max_id || 0
    });
    return this.validateResponse(response);
  }
}

module.exports = AutoSweepApi;
