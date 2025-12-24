/**
 * Web3 API - MPC Web3 transaction operations
 * Provides methods for creating, accelerating, and querying Web3 transactions
 * @class Web3Api
 * @extends MpcBaseApi
 */
const MpcBaseApi = require('./MpcBaseApi');

class Web3Api extends MpcBaseApi {
  /**
   * Creates a new Web3Api instance
   * @param {MpcConfig} config - MPC configuration object
   */
  constructor(config) {
    super(config);
  }

  /**
   * Creates a Web3 transaction
   * @param {Object} params - Transaction parameters
   * @param {string} params.request_id - Unique request ID
   * @param {number} params.sub_wallet_id - Sub-wallet ID
   * @param {string} params.chain_id - Chain ID
   * @param {string} params.from_addr - From address
   * @param {string} params.to_addr - To address
   * @param {string} params.value - Transaction value
   * @param {string} [params.data] - Transaction data (hex string)
   * @param {string} [params.gas_price] - Gas price
   * @param {string} [params.gas_limit] - Gas limit
   * @param {string} [params.nonce] - Transaction nonce
   * @returns {Promise<Object>} Created transaction result
   * @example
   * const tx = await web3Api.createWeb3Trans({
   *   request_id: 'unique-id',
   *   sub_wallet_id: 123,
   *   chain_id: '1',
   *   from_addr: '0x123...',
   *   to_addr: '0x456...',
   *   value: '1000000000000000000'
   * });
   */
  async createWeb3Trans(params) {
    if (!params.request_id || !params.sub_wallet_id || !params.chain_id || 
        !params.from_addr || !params.to_addr || !params.value) {
      throw new Error('Required parameters: request_id, sub_wallet_id, chain_id, from_addr, to_addr, value');
    }

    const requestData = {
      request_id: params.request_id,
      sub_wallet_id: params.sub_wallet_id,
      chain_id: params.chain_id,
      from_addr: params.from_addr,
      to_addr: params.to_addr,
      value: params.value
    };

    if (params.data) {
      requestData.data = params.data;
    }

    if (params.gas_price) {
      requestData.gas_price = params.gas_price;
    }

    if (params.gas_limit) {
      requestData.gas_limit = params.gas_limit;
    }

    if (params.nonce) {
      requestData.nonce = params.nonce;
    }

    const response = await this.post('/api/mpc/web3/trans/create', requestData);
    return this.validateResponse(response);
  }

  /**
   * Accelerates a Web3 transaction
   * When a transfer is signed but has not been confirmed on the blockchain for a long time 
   * due to insufficient fees, it can be accelerated by specifying a higher fee
   * @param {Object} params - Acceleration parameters
   * @param {string} params.request_id - Original request ID
   * @param {string} params.gas_price - New gas price (higher than original)
   * @param {string} [params.gas_limit] - New gas limit (optional)
   * @returns {Promise<boolean>} Acceleration result
   * @example
   * const result = await web3Api.accelerationWeb3Trans({
   *   request_id: 'original-request-id',
   *   gas_price: '20000000000'
   * });
   */
  async accelerationWeb3Trans(params) {
    if (!params.request_id || !params.gas_price) {
      throw new Error('Required parameters: request_id, gas_price');
    }

    const requestData = {
      request_id: params.request_id,
      gas_price: params.gas_price
    };

    if (params.gas_limit) {
      requestData.gas_limit = params.gas_limit;
    }

    const response = await this.post('/api/mpc/web3/trans/pending', requestData);
    return this.validateResponse(response);
  }

  /**
   * Gets Web3 transaction records
   * Get all Web3 transaction records under a wallet, maximum of 100 records
   * @param {Object} params - Query parameters
   * @param {Array<string>} params.request_ids - Request IDs (up to 100)
   * @returns {Promise<Object>} Web3 transaction records
   * @example
   * const records = await web3Api.getWeb3Records({
   *   request_ids: ['req-1', 'req-2']
   * });
   */
  async getWeb3Records(params) {
    if (!params.request_ids || !Array.isArray(params.request_ids) || params.request_ids.length === 0) {
      throw new Error('Parameter "request_ids" is required and must be a non-empty array');
    }

    const response = await this.get('/api/mpc/web3/trans_list', {
      ids: params.request_ids.join(',')
    });
    return this.validateResponse(response);
  }

  /**
   * Synchronizes Web3 transaction records
   * Get all Web3 transaction records under a wallet, maximum of 100 records
   * @param {Object} params - Query parameters
   * @param {number} [params.max_id=0] - Starting ID of Web3 transactions
   * @returns {Promise<Object>} Synchronized Web3 records
   * @example
   * const records = await web3Api.syncWeb3Records({ max_id: 0 });
   */
  async syncWeb3Records(params = {}) {
    const response = await this.get('/api/mpc/web3/sync_trans_list', {
      max_id: params.max_id || 0
    });
    return this.validateResponse(response);
  }
}

module.exports = Web3Api;
