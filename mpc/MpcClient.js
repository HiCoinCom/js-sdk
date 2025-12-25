/**
 * MPC Client - Main entry point for MPC API operations
 * Provides factory methods for creating MPC API instances
 * Uses Builder pattern for flexible configuration
 * @class MpcClient
 */
const MpcConfig = require('./MpcConfig');

// Lazy-load API classes
let WalletApi, DepositApi, WithdrawApi, Web3Api, AutoSweepApi, NotifyApi, WorkSpaceApi, TronResourceApi;

class MpcClient {
  /**
   * Private constructor - use Builder to create instances
   * @param {MpcConfig} config - MPC configuration object
   * @private
   */
  constructor(config) {
    this.config = config;
    this.config.validate();
  }

  /**
   * Gets WalletApi instance for wallet operations
   * @returns {WalletApi} WalletApi instance
   */
  getWalletApi() {
    if (!WalletApi) {
      WalletApi = require('./api/WalletApi');
    }
    return new WalletApi(this.config);
  }

  /**
   * Gets DepositApi instance for deposit operations
   * @returns {DepositApi} DepositApi instance
   */
  getDepositApi() {
    if (!DepositApi) {
      DepositApi = require('./api/DepositApi');
    }
    return new DepositApi(this.config);
  }

  /**
   * Gets WithdrawApi instance for withdrawal operations
   * @returns {WithdrawApi} WithdrawApi instance
   */
  getWithdrawApi() {
    if (!WithdrawApi) {
      WithdrawApi = require('./api/WithdrawApi');
    }
    return new WithdrawApi(this.config);
  }

  /**
   * Gets Web3Api instance for Web3 operations
   * @returns {Web3Api} Web3Api instance
   */
  getWeb3Api() {
    if (!Web3Api) {
      Web3Api = require('./api/Web3Api');
    }
    return new Web3Api(this.config);
  }

  /**
   * Gets AutoSweepApi instance for auto-sweep operations
   * @returns {AutoSweepApi} AutoSweepApi instance
   */
  getAutoSweepApi() {
    if (!AutoSweepApi) {
      AutoSweepApi = require('./api/AutoSweepApi');
    }
    return new AutoSweepApi(this.config);
  }

  /**
   * Gets NotifyApi instance for notification operations
   * @returns {NotifyApi} NotifyApi instance
   */
  getNotifyApi() {
    if (!NotifyApi) {
      NotifyApi = require('./api/NotifyApi');
    }
    return new NotifyApi(this.config);
  }

  /**
   * Gets WorkSpaceApi instance for workspace operations
   * @returns {WorkSpaceApi} WorkSpaceApi instance
   */
  getWorkSpaceApi() {
    if (!WorkSpaceApi) {
      WorkSpaceApi = require('./api/WorkSpaceApi');
    }
    return new WorkSpaceApi(this.config);
  }

  /**
   * Gets TronResourceApi instance for TRON resource operations
   * @returns {TronResourceApi} TronResourceApi instance
   */
  getTronResourceApi() {
    if (!TronResourceApi) {
      TronResourceApi = require('./api/TronResourceApi');
    }
    return new TronResourceApi(this.config);
  }

  /**
   * Creates a new Builder instance for configuring MpcClient
   * @returns {Builder} Builder instance
   * @static
   */
  static newBuilder() {
    return new Builder();
  }
}

/**
 * Builder class for constructing MpcClient instances
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
   * Sets the API domain URL
   * @param {string} domain - API domain URL
   * @returns {Builder} This builder instance for chaining
   */
  setDomain(domain) {
    this.options.domain = domain;
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
   * @param {string} rsaPrivateKey - RSA private key
   * @returns {Builder} This builder instance for chaining
   */
  setRsaPrivateKey(rsaPrivateKey) {
    this.options.rsaPrivateKey = rsaPrivateKey;
    return this;
  }

  /**
   * Sets the WaaS server public key for response decryption
   * @param {string} waasPublicKey - WaaS server public key
   * @returns {Builder} This builder instance for chaining
   */
  setWaasPublicKey(waasPublicKey) {
    this.options.waasPublicKey = waasPublicKey;
    return this;
  }

  /**
   * Sets the API key
   * @param {string} apiKey - API key for authentication
   * @returns {Builder} This builder instance for chaining
   */
  setApiKey(apiKey) {
    this.options.apiKey = apiKey;
    return this;
  }

  /**
   * Sets the signing private key for withdrawal/Web3 transaction signatures
   * @param {string} signPrivateKey - RSA private key for transaction signing (optional)
   * @returns {Builder} This builder instance for chaining
   */
  setSignPrivateKey(signPrivateKey) {
    this.options.signPrivateKey = signPrivateKey;
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
   * Enables or disables debug mode
   * @param {boolean} debug - Debug flag
   * @returns {Builder} This builder instance for chaining
   */
  setDebug(debug) {
    this.options.debug = debug;
    return this;
  }

  /**
   * Builds and returns a configured MpcClient instance
   * @returns {MpcClient} Configured MpcClient instance
   * @throws {Error} If required configuration is missing
   */
  build() {
    const config = new MpcConfig(this.options);
    return new MpcClient(config);
  }
}

// Export both for compatibility
module.exports = MpcClient;
module.exports.MpcClient = MpcClient;
module.exports.MpcClientFactory = MpcClient; // Alias for backward compatibility
