/**
 * MPC Base API Class
 * Provides common functionality for all MPC API implementations
 * Implements the same encryption flow as Java SDK:
 * - Request: encrypt params with private key, send as {app_id, data}
 * - Response: decrypt data field with public key
 * @class MpcBaseApi
 * @abstract
 */
const MpcHttpClient = require('../../utils/MpcHttpClient');
const RsaCryptoProvider = require('../../utils/RsaCryptoProvider');

class MpcBaseApi {
  /**
   * Creates a base MPC API instance
   * @param {MpcConfig} config - MPC configuration object
   */
  constructor(config) {
    this.config = config;
    this.httpClient = new MpcHttpClient(config);
    
    // Use custom crypto provider or create default RSA provider
    if (config.cryptoProvider) {
      this.cryptoProvider = config.cryptoProvider;
    } else if (config.rsaPrivateKey) {
      this.cryptoProvider = new RsaCryptoProvider({
        privateKey: config.rsaPrivateKey,
        publicKey: config.waasPublicKey || '', // WaaS server public key for decryption
        signPrivateKey: config.signPrivateKey || '', // Private key for signing transactions
        charset: 'UTF-8'
      });
    }
  }

  /**
   * Builds the request args JSON with common parameters
   * Matches Java SDK: args.setCharset(), args.setTime(), args.toJson()
   * @param {Object} data - API-specific request data
   * @returns {string} JSON string of request args
   * @private
   */
  buildRequestArgs(data = {}) {
    const args = {
      ...data,
      time: Date.now(),
      charset: 'utf-8'
    };
    return JSON.stringify(args);
  }

  /**
   * Executes an MPC API request
   * Flow matches Java SDK invoke():
   * 1. Serialize params to JSON
   * 2. Encrypt with private key
   * 3. Send only app_id and encrypted data
   * 4. Decrypt response data with public key
   * @param {string} method - HTTP method (GET, POST, etc.)
   * @param {string} path - API path
   * @param {Object} [data={}] - Request data
   * @returns {Promise<Object>} API response (decrypted if encrypted)
   * @protected
   */
  async executeRequest(method, path, data = {}) {
    // Step 1: Build request args JSON (matches Java SDK args.toJson())
    const rawJson = this.buildRequestArgs(data);
    
    if (this.config.debug) {
      console.log('[MPC Request Args]:', rawJson);
    }

    // Step 2: Encrypt with private key (matches Java SDK dataCrypto.encode(raw))
    let encryptedData = '';
    if (this.cryptoProvider) {
      try {
        encryptedData = this.cryptoProvider.encryptWithPrivateKey(rawJson);
        if (this.config.debug) {
          console.log('[MPC Encrypted Data]:', encryptedData.substring(0, 100) + '...');
        }
      } catch (e) {
        throw new Error(`Failed to encrypt request data: ${e.message}`);
      }
    }

    // Step 3: Send request with only app_id and data
    const response = await this.httpClient.request({
      method,
      path,
      encryptedData,
    });

    if (this.config.debug) {
      console.log('[MPC Response]:', response);
    }

    // Step 4: Check if response has encrypted data field and decrypt
    if (response && response.data && typeof response.data === 'string') {
      // MPC API returns encrypted data, need to decrypt with public key
      if (this.cryptoProvider) {
        try {
          const decrypted = this.cryptoProvider.decryptWithPublicKey(response.data);
          if (this.config.debug) {
            console.log('[MPC Decrypted]:', decrypted);
          }
          // Parse decrypted JSON and return complete response
          const decryptedData = JSON.parse(decrypted);
          return decryptedData;
        } catch (e) {
          if (this.config.debug) {
            console.error('[MPC Decrypt Error]:', e.message);
          }
          // If decryption fails, might be an error response, return as-is
          return response;
        }
      }
    }

    return response;
  }

  /**
   * Executes a POST request
   * @param {string} path - API path
   * @param {Object} [data={}] - Request data
   * @returns {Promise<Object>} API response
   * @protected
   */
  async post(path, data = {}) {
    return this.executeRequest('POST', path, data);
  }

  /**
   * Executes a GET request
   * @param {string} path - API path
   * @param {Object} [data={}] - Request data
   * @returns {Promise<Object>} API response
   * @protected
   */
  async get(path, data = {}) {
    return this.executeRequest('GET', path, data);
  }

  /**
   * Validates response and handles errors
   * @param {Object} response - API response
   * @returns {Object} Validated response
   * @protected
   */
  validateResponse(response) {
    // Response is already decrypted, just return it
    return response;
  }
}

module.exports = MpcBaseApi;
