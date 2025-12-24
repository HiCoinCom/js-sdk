/**
 * WorkSpace API - MPC workspace management operations
 * Provides methods for querying supported chains, coins, and blockchain information
 * @class WorkSpaceApi
 * @extends MpcBaseApi
 */
const MpcBaseApi = require('./MpcBaseApi');

class WorkSpaceApi extends MpcBaseApi {
  /**
   * Creates a new WorkSpaceApi instance
   * @param {MpcConfig} config - MPC configuration object
   */
  constructor(config) {
    super(config);
  }

  /**
   * Gets supported main chains
   * Get the supported MPC main chain coins and the MPC main chain coins opened in ChainUp Custody
   * @returns {Promise<Object>} Supported main chains
   * @example
   * const chains = await workSpaceApi.getSupportMainChain();
   */
  async getSupportMainChain() {
    const response = await this.get('/api/mpc/wallet/open_coin');
    return this.validateResponse(response);
  }

  /**
   * Gets MPC workspace coin details
   * Get the details of MPC workspace's main chain coins and tokens supported
   * @param {Object} [params={}] - Query parameters (snake_case naming)
   * @param {string} [params.symbol] - Unique identifier for the coin (e.g., "USDTERC20")
   * @param {string} [params.base_symbol] - Main chain coin symbol (e.g., "ETH")
   * @param {boolean} [params.open_chain] - true: opened coins, false: unopened coins
   * @param {number} [params.max_id] - Starting ID of the currency
   * @param {number} [params.limit=1500] - Number of currencies to get (default: 1500)
   * @returns {Promise<Object>} Coin details
   * @example
   * const coins = await workSpaceApi.getCoinDetails({
   *   base_symbol: 'ETH',
   *   open_chain: true,
   *   limit: 100
   * });
   */
  async getCoinDetails(params = {}) {
    // Pass params directly using snake_case (same as Java SDK)
    const response = await this.get('/api/mpc/coin_list', params);
    return this.validateResponse(response);
  }

  /**
   * Gets last block height
   * Get the latest block height of the specified main chain
   * @param {Object} params - Query parameters (snake_case naming)
   * @param {string} params.base_symbol - Main chain coin symbol (e.g., "ETH", "BTC")
   * @returns {Promise<Object>} Block height information
   * @example
   * const blockInfo = await workSpaceApi.getLastBlockHeight({
   *   base_symbol: 'ETH'
   * });
   */
  async getLastBlockHeight(params) {
    if (!params.base_symbol) {
      throw new Error('Parameter "base_symbol" is required');
    }

    // Pass params directly using snake_case (same as Java SDK)
    const response = await this.get('/api/mpc/chain_height', params);
    return this.validateResponse(response);
  }
}

module.exports = WorkSpaceApi;
