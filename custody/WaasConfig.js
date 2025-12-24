/**
 * WaaS Configuration Class
 * Stores configuration parameters for WaaS (Wallet-as-a-Service) API client
 * @class WaasConfig
 */
class WaasConfig {
  /**
   * Creates a new WaaS configuration
   * @param {Object} options - Configuration options
   * @param {string} options.host - API host URL
   * @param {string} options.appId - Application ID
   * @param {string} [options.privateKey] - RSA private key for signing requests (required if no cryptoProvider)
   * @param {string} [options.publicKey] - ChainUp public key for verifying responses (required if no cryptoProvider)
   * @param {ICryptoProvider} [options.cryptoProvider] - Custom crypto provider implementation
   * @param {string} [options.version='v1'] - API version
   * @param {string} [options.charset='UTF-8'] - Request charset encoding
   * @param {boolean} [options.debug=false] - Enable debug mode
   */
  constructor(options = {}) {
    this.host = options.host || '';
    this.appId = options.appId || '';
    this.privateKey = options.privateKey || '';
    this.publicKey = options.publicKey || '';
    this.cryptoProvider = options.cryptoProvider || null;
    this.version = options.version || 'v1';
    this.charset = options.charset || 'UTF-8';
    this.debug = options.debug || false;
  }

  /**
   * Validates the configuration
   * @returns {boolean} True if configuration is valid
   * @throws {Error} If required fields are missing
   */
  validate() {
    if (!this.host) {
      throw new Error('WaasConfig: host is required');
    }
    if (!this.appId) {
      throw new Error('WaasConfig: appId is required');
    }
    
    // Either cryptoProvider or privateKey/publicKey must be provided
    if (!this.cryptoProvider) {
      if (!this.privateKey) {
        throw new Error('WaasConfig: privateKey is required (or provide cryptoProvider)');
      }
      if (!this.publicKey) {
        throw new Error('WaasConfig: publicKey is required (or provide cryptoProvider)');
      }
    }
    
    return true;
  }

  /**
   * Gets the full API URL
   * @param {string} path - API path
   * @returns {string} Full API URL
   */
  getUrl(path) {
    return `${this.host}${this.version}${path}`;
  }
}

module.exports = WaasConfig;
