/**
 * Base API Class
 * Provides common functionality for all WaaS API implementations
 * Implements the same encryption flow as Java SDK:
 * - Request: encrypt params with private key, send as {app_id, data}
 * - Response: decrypt data field with public key
 * @class BaseApi
 * @abstract
 */
const HttpClient = require('../../utils/HttpClient');
const RsaCryptoProvider = require('../../utils/RsaCryptoProvider');

class BaseApi {
  /**
   * Creates a base API instance
   * @param {WaasConfig} config - WaaS configuration object
   */
  constructor(config) {
    this.config = config;
    this.httpClient = new HttpClient(config);
    
    // Use custom crypto provider or create default RSA provider
    if (config.cryptoProvider) {
      this.cryptoProvider = config.cryptoProvider;
    } else {
      this.cryptoProvider = new RsaCryptoProvider({
        privateKey: config.privateKey,
        publicKey: config.publicKey,
        charset: config.charset
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
      charset: this.config.charset || 'utf-8'
    };
    return JSON.stringify(args);
  }

  /**
   * Executes an API request with signing and encryption
   * Flow matches Java SDK WaasApi.invoke():
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
      console.log('[WaaS Request Args]:', rawJson);
    }

    // Step 2: Encrypt with private key (matches Java SDK dataCrypto.encode(raw))
    let encryptedData = '';
    if (this.cryptoProvider) {
      try {
        encryptedData = this.cryptoProvider.encryptWithPrivateKey(rawJson);
        if (this.config.debug) {
          console.log('[WaaS Encrypted Data]:', encryptedData.substring(0, 100) + '...');
        }
      } catch (e) {
        throw new Error(`Failed to encrypt request data: ${e.message}`);
      }
    }

    // Step 3: Send request with only app_id and data
    const response = await this.httpClient.request({
      method,
      path,
      data: {
        app_id: this.config.appId,
        data: encryptedData,
      },
    });

    if (this.config.debug) {
      console.log('[WaaS Response]:', response);
    }

    // Step 4: Parse response and decrypt data if needed
    let parsedResponse = response;
    if (typeof response === 'string') {
      try {
        parsedResponse = JSON.parse(response);
      } catch (e) {
        throw new Error(`Invalid JSON response: ${response}`);
      }
    }

    // Check if response has encrypted data field and decrypt
    if (parsedResponse && parsedResponse.data && typeof parsedResponse.data === 'string') {
      if (this.cryptoProvider) {
        try {
          const decrypted = this.cryptoProvider.decryptWithPublicKey(parsedResponse.data);
          if (this.config.debug) {
            console.log('[WaaS Decrypted]:', decrypted);
          }
          // Parse decrypted JSON and return complete response
          const decryptedData = JSON.parse(decrypted);
          return decryptedData;
        } catch (e) {
          if (this.config.debug) {
            console.error('[WaaS Decrypt Error]:', e.message);
          }
          // If decryption fails, might be an error response, return as-is
          return parsedResponse;
        }
      }
    }

    return parsedResponse;
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
   * @returns {Object} Validated response data
   * @throws {Error} If response indicates an error
   * @protected
   */
  validateResponse(response) {
    if (typeof response === 'string') {
      try {
        response = JSON.parse(response);
      } catch (e) {
        throw new Error(`Invalid JSON response: ${response}`);
      }
    }

    if (response.code !== 0 && response.code !== '0') {
      throw new Error(`API Error [${response.code}]: ${response.msg || 'Unknown error'}`);
    }

    return response.data || response;
  }
}

module.exports = BaseApi;
