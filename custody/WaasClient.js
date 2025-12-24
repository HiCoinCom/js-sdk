/**
 * WaaS Client - Main entry point for WaaS API operations
 * Provides factory methods for creating API instances
 * Uses Builder pattern for flexible configuration
 * @class WaasClient
 */
const WaasConfig = require('./WaasConfig');
const UserApi = require('./api/UserApi');
const AccountApi = require('./api/AccountApi');
const BillingApi = require('./api/BillingApi');
const CoinApi = require('./api/CoinApi');
const TransferApi = require('./api/TransferApi');
const AsyncNotifyApi = require('./api/AsyncNotifyApi');

class WaasClient {
  /**
   * Private constructor - use Builder to create instances
   * @param {WaasConfig} config - WaaS configuration object
   * @private
   */
  constructor(config) {
    this.config = config;
    this.config.validate();
  }

  /**
   * Gets UserApi instance for user-related operations
   * @returns {UserApi} UserApi instance
   */
  getUserApi() {
    return new UserApi(this.config);
  }

  /**
   * Gets AccountApi instance for account-related operations
   * @returns {AccountApi} AccountApi instance
   */
  getAccountApi() {
    return new AccountApi(this.config);
  }

  /**
   * Gets BillingApi instance for billing and transaction operations
   * @returns {BillingApi} BillingApi instance
   */
  getBillingApi() {
    return new BillingApi(this.config);
  }

  /**
   * Gets CoinApi instance for coin and blockchain operations
   * @returns {CoinApi} CoinApi instance
   */
  getCoinApi() {
    return new CoinApi(this.config);
  }

  /**
   * Gets TransferApi instance for transfer operations
   * @returns {TransferApi} TransferApi instance
   */
  getTransferApi() {
    return new TransferApi(this.config);
  }

  /**
   * Gets AsyncNotifyApi instance for async notification operations
   * @returns {AsyncNotifyApi} AsyncNotifyApi instance
   */
  getAsyncNotifyApi() {
    return new AsyncNotifyApi(this.config);
  }

  /**
   * Creates a new Builder instance for configuring WaasClient
   * @returns {Builder} Builder instance
   * @static
   */
  static newBuilder() {
    return new Builder();
  }
}

/**
 * Builder class for constructing WaasClient instances
 * Implements the Builder pattern for flexible configuration
 * @class Builder
 */
class Builder {
  /**
   * Creates a new Builder instance
   */
  constructor() {
    this.options = {};
  }

  /**
   * Sets the API host URL
   * @param {string} host - API host URL
   * @returns {Builder} This builder instance for chaining
   */
  setHost(host) {
    this.options.host = host;
    return this;
  }

  /**
   * Sets the application ID
   * @param {string} appId - Application ID
   * @returns {Builder} This builder instance for chaining
   */
  setAppId(appId) {
    this.options.appId = appId;
    return this;
  }

  /**
   * Sets the RSA private key
   * @param {string} privateKey - RSA private key
   * @returns {Builder} This builder instance for chaining
   */
  setPrivateKey(privateKey) {
    this.options.privateKey = privateKey;
    return this;
  }

  /**
   * Sets the ChainUp public key
   * @param {string} publicKey - ChainUp public key
   * @returns {Builder} This builder instance for chaining
   */
  setPublicKey(publicKey) {
    this.options.publicKey = publicKey;
    return this;
  }

  /**
   * Sets a custom crypto provider for encryption/decryption
   * @param {ICryptoProvider} cryptoProvider - Custom crypto provider implementation
   * @returns {Builder} This builder instance for chaining
   */
  setCryptoProvider(cryptoProvider) {
    this.options.cryptoProvider = cryptoProvider;
    return this;
  }

  /**
   * Sets the API version
   * @param {string} version - API version (default: 'v1')
   * @returns {Builder} This builder instance for chaining
   */
  setVersion(version) {
    this.options.version = version;
    return this;
  }

  /**
   * Sets the charset encoding
   * @param {string} charset - Charset encoding (default: 'UTF-8')
   * @returns {Builder} This builder instance for chaining
   */
  setCharset(charset) {
    this.options.charset = charset;
    return this;
  }

  /**
   * Enables or disables debug mode
   * @param {boolean} debug - Debug flag
   * @returns {Builder} This builder instance for chaining
   */
  setDebug(debug) {
    this.options.debug = debug;
    return this;
  }

  /**
   * Builds and returns a configured WaasClient instance
   * @returns {WaasClient} Configured WaasClient instance
   * @throws {Error} If required configuration is missing
   */
  build() {
    const config = new WaasConfig(this.options);
    return new WaasClient(config);
  }
}

module.exports = WaasClient;
