/**
 * Coin API - Cryptocurrency information operations
 * Provides methods for querying supported cryptocurrencies
 * @class CoinApi
 * @extends BaseApi
 */
const BaseApi = require('./BaseApi');

class CoinApi extends BaseApi {
  /**
   * Creates a new CoinApi instance
   * @param {WaasConfig} config - WaaS configuration object
   */
  constructor(config) {
    super(config);
  }

  /**
   * Gets supported coin list
   * Retrieves information about all cryptocurrencies supported by the platform
   * @param {Object} [params={}] - Optional parameters
   * @returns {Promise<Array>} List of supported coins with details
   * @see {@link http://docs.hicoin.vip/zh/latest/API-WaaS-V2/api/user_getCoinList.html}
   * @example
   * const coinList = await coinApi.getCoinList();
   * // Returns array of coin info with properties:
   * // - symbol: Coin symbol
   * // - icon: Icon URL
   * // - real_symbol: Real symbol
   * // - base_symbol: Base chain symbol
   * // - decimals: Decimal places
   * // - contract_address: Token contract address (if applicable)
   * // - deposit_confirmation: Required confirmations for deposit
   * // - support_memo: Whether memo/tag is supported
   * // - support_token: Whether tokens are supported
   * // - address_regex: Address validation regex
   * // - address_tag_regex: Memo/tag validation regex
   * // - min_deposit: Minimum deposit amount
   */
  async getCoinList(params = {}) {
    const response = await this.post('/coin/list', params);
    return this.validateResponse(response);
  }
}

module.exports = CoinApi;
