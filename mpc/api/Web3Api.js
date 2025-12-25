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
   * @param {string} params.request_id - Unique request ID (required)
   * @param {number} params.sub_wallet_id - Sub-wallet ID (required)
   * @param {string} params.main_chain_symbol - Main chain coin symbol, e.g. ETH (required)
   * @param {string} params.interactive_contract - Interactive contract address (required)
   * @param {string} params.amount - Transfer amount (required)
   * @param {string} params.gas_price - Gas price in Gwei (required)
   * @param {string} params.gas_limit - Gas limit (required)
   * @param {string} params.input_data - Hexadecimal data for contract transaction (required)
   * @param {string} params.trans_type - Transaction type: 0=Authorization, 1=Other (required)
   * @param {string} [params.from] - Transaction initiation address (optional, defaults to wallet's commonly used address)
   * @param {string} [params.dapp_name] - Dapp name (optional)
   * @param {string} [params.dapp_url] - Dapp URL (optional)
   * @param {string} [params.dapp_img] - Dapp image (optional)
   * @param {boolean} [params.need_transaction_sign=false] - Whether transaction signature is required
   * @returns {Promise<Object>} Created transaction result
   * @example
   * const tx = await web3Api.createWeb3Trans({
   *   request_id: 'unique-id',
   *   sub_wallet_id: 123,
   *   main_chain_symbol: 'ETH',
   *   interactive_contract: '0x123...',
   *   amount: '1000000000000000000',
   *   gas_price: '20',
   *   gas_limit: '21000',
   *   input_data: '0x',
   *   trans_type: '1'
   * });
   */
  async createWeb3Trans(params) {
    // Validate required parameters
    if (!params.request_id || !params.sub_wallet_id || !params.main_chain_symbol || 
        !params.interactive_contract || !params.amount || !params.gas_price || 
        !params.gas_limit || !params.input_data || !params.trans_type) {
      throw new Error('Required parameters: request_id, sub_wallet_id, main_chain_symbol, interactive_contract, amount, gas_price, gas_limit, input_data, trans_type');
    }

    const needTransactionSign = params.need_transaction_sign || false;

    // Check if signPrivateKey is configured when signature is required
    if (needTransactionSign && !this.config.signPrivateKey) {
      throw new Error('MPC web3 transaction requires signPrivateKey in config when need_transaction_sign is true');
    }

    const requestData = {
      request_id: params.request_id,
      sub_wallet_id: params.sub_wallet_id,
      main_chain_symbol: params.main_chain_symbol,
      interactive_contract: params.interactive_contract,
      amount: params.amount,
      gas_price: params.gas_price,
      gas_limit: params.gas_limit,
      input_data: params.input_data,
      trans_type: params.trans_type
    };

    // Add optional parameters
    if (params.from) {
      requestData.from = params.from;
    }

    if (params.dapp_name) {
      requestData.dapp_name = params.dapp_name;
    }

    if (params.dapp_url) {
      requestData.dapp_url = params.dapp_url;
    }

    if (params.dapp_img) {
      requestData.dapp_img = params.dapp_img;
    }

    // Generate signature if needed
    if (needTransactionSign) {
      const MpcSignUtil = require('../../utils/MpcSignUtil');
      const sign = MpcSignUtil.generateWeb3Sign(
        {
          request_id: params.request_id,
          sub_wallet_id: params.sub_wallet_id.toString(),
          main_chain_symbol: params.main_chain_symbol,
          interactive_contract: params.interactive_contract,
          amount: params.amount,
          input_data: params.input_data
        },
        this.config.signPrivateKey
      );

      if (!sign) {
        throw new Error('Failed to generate web3 transaction signature');
      }
  
      requestData.sign = sign;
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

    const response = await this.post('/api/mpc/web3/pending', requestData);
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
