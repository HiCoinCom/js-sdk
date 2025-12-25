/**
 * MPC HTTP Client Class
 * Handles HTTP communication with the MPC API
 * Implements the same request format as Java SDK:
 * - Request params: app_id + data (encrypted with private key)
 * - Response data: encrypted with private key, decrypt with public key
 * @class MpcHttpClient
 */
const request = require('request');

class MpcHttpClient {
  /**
   * Creates a new MPC HTTP client instance
   * @param {MpcConfig} config - MPC configuration object
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * Executes an HTTP request
   * Request format matches Java SDK: only app_id and data (encrypted) are sent
   * @param {Object} options - Request options
   * @param {string} options.method - HTTP method (GET, POST, etc.)
   * @param {string} options.path - API path
   * @param {string} options.encryptedData - RSA encrypted request data
   * @returns {Promise<Object>} Response data
   */
  async request(options) {
    const { method, path, encryptedData } = options;

    const url = this.config.getUrl(path);

    // Only two parameters: app_id and data (encrypted)
    // This matches Java SDK: Args params = new Args(this.cfg.getAppId(), data);
    const params = {
      app_id: this.config.appId,
      data: encryptedData
    };

    const requestOptions = {
      method,
      url,
      headers: {},
      timeout: 30000, // 30 seconds timeout
    };

    if (method === 'POST') {
      // Use form submission (application/x-www-form-urlencoded)
      requestOptions.form = params;
    } else if (method === 'GET') {
      requestOptions.qs = params;
    }

    if (this.config.debug) {
      console.log('[MPC HTTP Request]:', {
        method,
        url,
        params: {
          app_id: params.app_id,
          data: params.data ? params.data.substring(0, 100) + '...' : ''
        }
      });
    }

    return new Promise((resolve, reject) => {
      request(requestOptions, (error, response, body) => {
        if (error) {
          reject(new Error(`MPC HTTP request failed: ${error.message}`));
          return;
        }

        if (response.statusCode !== 200) {
          reject(new Error(`MPC HTTP ${response.statusCode}: ${body}`));
          return;
        }

        if (this.config.debug) {
          console.log('[MPC HTTP Response]:', body);
        }

        // Parse JSON response
        try {
          const jsonResponse = typeof body === 'string' ? JSON.parse(body) : body;
          resolve(jsonResponse);
        } catch (e) {
          reject(new Error(`Failed to parse MPC response: ${e.message}`));
        }
      });
    });
  }

  /**
   * Executes a POST request
   * @param {string} path - API path
   * @param {string} encryptedData - Encrypted request data
   * @returns {Promise<Object>} Response data
   */
  async post(path, encryptedData) {
    return this.request({ method: 'POST', path, encryptedData });
  }

  /**
   * Executes a GET request
   * @param {string} path - API path
   * @param {string} encryptedData - Encrypted request data
   * @returns {Promise<Object>} Response data
   */
  async get(path, encryptedData) {
    return this.request({ method: 'GET', path, encryptedData });
  }
}

module.exports = MpcHttpClient;
