/**
 * MPC Configuration Class
 * Stores configuration parameters for MPC (Multi-Party Computation) API client
 * @class MpcConfig
 */
const RSAUtil = require('../utils/RSAUtil');

class MpcConfig {
  /**
   * Creates a new MPC configuration
   * @param {Object} options - Configuration options
   * @param {string} options.domain - API domain URL
   * @param {string} options.appId - Application ID
   * @param {string} [options.rsaPrivateKey] - RSA private key (required if no cryptoProvider)
   * @param {string} [options.waasPublicKey] - WaaS server public key for decrypting responses
   * @param {string} [options.apiKey] - API key for authentication
   * @param {ICryptoProvider} [options.cryptoProvider] - Custom crypto provider implementation
   * @param {boolean} [options.debug=false] - Enable debug mode
   */
  constructor(options = {}) {
    this.domain = options.domain || 'https://openapi.chainup.com/';
    this.appId = options.appId || '';
    // Auto-format RSA keys to proper PEM format
    this.rsaPrivateKey = options.rsaPrivateKey ? RSAUtil.formatRSAKey(options.rsaPrivateKey, 'private') : '';
    this.waasPublicKey = options.waasPublicKey ? RSAUtil.formatRSAKey(options.waasPublicKey, 'public') : '';
    this.apiKey = options.apiKey || '';
    // Use normalizeRSAKey to preserve original key format (PKCS#1 vs PKCS#8) for signing
    this.signPrivateKey = options.signPrivateKey ? RSAUtil.normalizeRSAKey(options.signPrivateKey, 'private') : '';
    this.cryptoProvider = options.cryptoProvider || null;
    this.debug = options.debug || false;
  }

  /**
   * Validates the configuration
   * @returns {boolean} True if configuration is valid
   * @throws {Error} If required fields are missing
   */
  validate() {
    if (!this.domain) {
      throw new Error('MpcConfig: domain is required');
    }
    if (!this.appId) {
      throw new Error('MpcConfig: appId is required');
    }
    
    // Either cryptoProvider or rsaPrivateKey must be provided
    if (!this.cryptoProvider && !this.rsaPrivateKey) {
      throw new Error('MpcConfig: rsaPrivateKey is required (or provide cryptoProvider)');
    }
    
    return true;
  }

  /**
   * Gets the full API URL
   * @param {string} path - API path
   * @returns {string} Full API URL
   */
  getUrl(path) {
    return `${this.domain}${path}`;
  }
}

module.exports = MpcConfig;
