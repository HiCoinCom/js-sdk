/**
 * Wallet API - MPC wallet management operations
 * Provides methods for creating and managing MPC wallets
 * Uses snake_case naming for parameters (same as Java SDK)
 * @class WalletApi
 * @extends MpcBaseApi
 */
const MpcBaseApi = require('./MpcBaseApi');

class WalletApi extends MpcBaseApi {
  /**
   * Creates a new WalletApi instance
   * @param {MpcConfig} config - MPC configuration object
   */
  constructor(config) {
    super(config);
  }

  /**
   * Creates a new wallet
   * Pass in the specified wallet name to create a new wallet for the main wallet
   * @param {Object} params - Wallet creation parameters (snake_case naming)
   * @param {string} params.sub_wallet_name - Wallet name (max 50 characters)
   * @param {number} [params.app_show_status=2] - Display status: 1 (show), 2 (hide, default)
   * @returns {Promise<Object>} Created wallet information with sub_wallet_id
   * @example
   * const wallet = await walletApi.createWallet({
   *   sub_wallet_name: 'My Wallet',
   *   app_show_status: 1
   * });
   */
  async createWallet(params) {
    if (!params.sub_wallet_name) {
      throw new Error('Parameter "sub_wallet_name" is required');
    }

    if (params.sub_wallet_name.length > 50) {
      throw new Error('Wallet name cannot be longer than 50 characters');
    }

    const response = await this.post('/api/mpc/sub_wallet/create', params);
    return this.validateResponse(response);
  }

  /**
   * Creates a wallet address
   * Create an address for a specified wallet and coin; the same wallet can have multiple addresses
   * @param {Object} params - Address creation parameters (snake_case naming)
   * @param {number} params.sub_wallet_id - Wallet ID
   * @param {string} params.symbol - Unique identifier for the coin (e.g., "ETH")
   * @returns {Promise<Object>} Created address information
   * @example
   * const address = await walletApi.createWalletAddress({
   *   sub_wallet_id: 123,
   *   symbol: 'ETH'
   * });
   */
  async createWalletAddress(params) {
    if (!params.sub_wallet_id) {
      throw new Error('Parameter "sub_wallet_id" is required');
    }

    if (!params.symbol) {
      throw new Error('Parameter "symbol" is required');
    }

    const response = await this.post('/api/mpc/sub_wallet/create/address', params);
    return this.validateResponse(response);
  }

  /**
   * Queries wallet address
   * List of wallet addresses
   * @param {Object} params - Query parameters (snake_case naming)
   * @param {number} params.sub_wallet_id - Wallet ID
   * @param {string} params.symbol - Unique identifier for the coin (e.g., "ETH")
   * @param {number} [params.max_id=0] - Starting address ID
   * @returns {Promise<Object>} Wallet address list
   * @example
   * const addresses = await walletApi.queryWalletAddress({
   *   sub_wallet_id: 123,
   *   symbol: 'ETH',
   *   max_id: 0
   * });
   */
  async queryWalletAddress(params) {
    if (!params.sub_wallet_id) {
      throw new Error('Parameter "sub_wallet_id" is required');
    }

    if (!params.symbol) {
      throw new Error('Parameter "symbol" is required');
    }

    const response = await this.post('/api/mpc/sub_wallet/get/address/list', params);
    return this.validateResponse(response);
  }

  /**
   * Gets wallet assets
   * Get the account assets under the specified wallet and coin
   * @param {Object} params - Query parameters (snake_case naming)
   * @param {number} params.sub_wallet_id - Wallet ID
   * @param {string} params.symbol - Unique identifier for the coin (e.g., "ETH")
   * @returns {Promise<Object>} Wallet asset information
   * @example
   * const assets = await walletApi.getWalletAssets({
   *   sub_wallet_id: 123,
   *   symbol: 'ETH'
   * });
   */
  async getWalletAssets(params) {
    if (!params.sub_wallet_id) {
      throw new Error('Parameter "sub_wallet_id" is required');
    }

    if (!params.symbol) {
      throw new Error('Parameter "symbol" is required');
    }

    const response = await this.get('/api/mpc/sub_wallet/assets', params);
    return this.validateResponse(response);
  }

  /**
   * Modifies the wallet display status
   * The display of the specified wallet in the App and web portal is essential for initiating transactions
   * @param {Object} params - Update parameters (snake_case naming)
   * @param {string} params.sub_wallet_ids - Wallet IDs (comma-separated string, e.g., "123,456")
   * @param {number} params.app_show_status - Display status: 1 (show), 2 (hide)
   * @returns {Promise<boolean>} Update result (true if successful)
   * @example
   * const result = await walletApi.changeWalletShowStatus({
   *   sub_wallet_ids: '123,456',
   *   app_show_status: 1
   * });
   */
  async changeWalletShowStatus(params) {
    if (!params.sub_wallet_ids) {
      throw new Error('Parameter "sub_wallet_ids" is required');
    }

    if (!params.app_show_status || (params.app_show_status !== 1 && params.app_show_status !== 2)) {
      throw new Error('Parameter "app_show_status" is required and must be 1 or 2');
    }

    const response = await this.post('/api/mpc/sub_wallet/change_show_status', params);
    const result = this.validateResponse(response);
    return result.code === '0';
  }

  /**
   * Verifies address information
   * Input a specific address and get the response of the corresponding custody user and currency information
   * @param {Object} params - Query parameters (snake_case naming)
   * @param {string} params.address - Any address
   * @param {string} [params.memo] - If it's a Memo type, input the memo
   * @returns {Promise<Object>} Address information
   * @example
   * const info = await walletApi.walletAddressInfo({
   *   address: '0x123...',
   *   memo: 'optional-memo'
   * });
   */
  async walletAddressInfo(params) {
    if (!params.address) {
      throw new Error('Parameter "address" is required');
    }

    const response = await this.get('/api/mpc/sub_wallet/address/info', params);
    return this.validateResponse(response);
  }
}

module.exports = WalletApi;
