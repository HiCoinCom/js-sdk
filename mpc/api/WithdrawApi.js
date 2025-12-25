/**
 * Withdraw API - MPC withdrawal management operations
 * Provides methods for initiating withdrawals and querying withdrawal records
 * @class WithdrawApi
 * @extends MpcBaseApi
 */
const MpcBaseApi = require('./MpcBaseApi');

class WithdrawApi extends MpcBaseApi {
  /**
   * Creates a new WithdrawApi instance
   * @param {MpcConfig} config - MPC configuration object
   */
  constructor(config) {
    super(config);
  }

  /**
   * Initiates a transfer (withdrawal)
   * @param {Object} params - Withdrawal parameters
   * @param {string} params.request_id - Unique request ID
   * @param {number} params.sub_wallet_id - Sub-wallet ID
   * @param {string} params.symbol - Coin symbol (e.g., "USDTERC20")
   * @param {string} params.amount - Withdrawal amount
   * @param {string} params.address_to - Destination address
   * @param {string} [params.from] - Specify the transfer coin address (optional)
   * @param {string} [params.memo] - Address memo (for coins that require it)
   * @param {string} [params.remark] - Withdrawal remark
   * @param {string} [params.outputs] - UTXO outputs (for BTC-like coins)
   * @param {boolean} [params.need_transaction_sign=false] - Whether to sign the transaction
   * @returns {Promise<{code: string, msg: string, data: {withdraw_id: number}}>} Withdrawal result
   * @example
   * const result = await withdrawApi.withdraw({
   *   request_id: 'unique-id',
   *   sub_wallet_id: 123,
   *   symbol: 'ETH',
   *   amount: '0.1',
   *   address_to: '0x123...'
   * });
   */
  async withdraw(params) {
    if (!params.request_id || !params.sub_wallet_id || !params.symbol || !params.amount || !params.address_to) {
      throw new Error('Required parameters: request_id, sub_wallet_id, symbol, amount, address_to');
    }

    const needTransactionSign = params.need_transaction_sign || false;

    // Check if signPrivateKey is configured when signature is required
    if (needTransactionSign && !this.config.signPrivateKey) {
      throw new Error('MPC withdrawal requires signPrivateKey in config when need_transaction_sign is true');
    }

    const requestData = {
      request_id: params.request_id,
      sub_wallet_id: params.sub_wallet_id,
      symbol: params.symbol,
      amount: params.amount,
      address_to: params.address_to
    };

    if (params.from) {
      requestData.from = params.from;
    }

    if (params.memo) {
      requestData.memo = params.memo;
    }

    if (params.remark) {
      requestData.remark = params.remark;
    }

    if (params.outputs) {
      requestData.outputs = params.outputs;
    }

    // Generate signature if needed
    if (needTransactionSign) {
      const MpcSignUtil = require('../../utils/MpcSignUtil');
      const sign = MpcSignUtil.generateWithdrawSign(
        {
          request_id: params.request_id,
          sub_wallet_id: params.sub_wallet_id.toString(),
          symbol: params.symbol,
          address_to: params.address_to,
          amount: params.amount,
          memo: params.memo || '',
          outputs: params.outputs || ''
        },
        this.config.signPrivateKey
      );

      if (!sign) {
        throw new Error('Failed to generate withdrawal signature');
      }
  
      requestData.sign = sign;
    }

    const response = await this.post('/api/mpc/billing/withdraw', requestData);
    return this.validateResponse(response);
  }

  /**
   * Gets transfer records
   * Get all wallet transfer records under the workspace, and return up to 100 records
   * @param {Object} params - Query parameters
   * @param {Array<string>} params.request_ids - Request IDs (up to 100)
   * @returns {Promise<{code: string, msg: string, data: Array}>} Withdrawal records
   * @example
   * const records = await withdrawApi.getWithdrawRecords({
   *   request_ids: ['req-1', 'req-2']
   * });
   */
  async getWithdrawRecords(params) {
    if (!params.request_ids || !Array.isArray(params.request_ids) || params.request_ids.length === 0) {
      throw new Error('Parameter "request_ids" is required and must be a non-empty array');
    }

    const response = await this.get('/api/mpc/billing/withdraw_list', {
      ids: params.request_ids.join(',')
    });
    return this.validateResponse(response);
  }

  /**
   * Synchronizes transfer(withdraw) records
   * Get all wallet transfer records under the workspace, and return up to 100 records
   * @param {Object} params - Query parameters
   * @param {number} [params.max_id=0] - Starting ID of withdraw records
   * @returns {Promise<{code: string, msg: string, data: Array}>} Synchronized withdrawal records
   * @example
   * const records = await withdrawApi.syncWithdrawRecords({ max_id: 0 });
   */
  async syncWithdrawRecords(params = {}) {
    const response = await this.get('/api/mpc/billing/sync_withdraw_list', {
      max_id: params.max_id || 0
    });
    return this.validateResponse(response);
  }
}

module.exports = WithdrawApi;
