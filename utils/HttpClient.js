/**
 * HTTP Client Class
 * Handles HTTP communication with the WaaS API
 * Provides methods for making HTTP requests with proper error handling
 * @class HttpClient
 */
const request = require('request');

class HttpClient {
  /**
   * Creates a new HTTP client instance
   * @param {WaasConfig} config - WaaS configuration object
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * Executes an HTTP request
   * @param {Object} options - Request options
   * @param {string} options.method - HTTP method (GET, POST, etc.)
   * @param {string} options.path - API path
   * @param {Object} [options.data={}] - Request data
   * @param {Object} [options.headers={}] - Additional headers
   * @returns {Promise<Object>} Response data
   */
  async request(options) {
    const { method, path, data = {}, headers = {} } = options;

    const url = this.config.getUrl(path);

    const requestOptions = {
      method,
      url,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...headers,
      },
      timeout: 30000, // 30 seconds timeout
    };

    // Set form data for POST requests
    if (method === 'POST') {
      requestOptions.form = data;
    } else if (method === 'GET') {
      requestOptions.qs = data;
    }

    if (this.config.debug) {
      console.log('[HTTP Request]:', {
        method,
        url,
        data,
      });
    }

    return new Promise((resolve, reject) => {
      request(requestOptions, (error, response, body) => {
        if (error) {
          reject(new Error(`HTTP request failed: ${error.message}`));
          return;
        }

        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}: ${body}`));
          return;
        }

        if (this.config.debug) {
          console.log('[HTTP Response]:', body);
        }

        resolve(body);
      });
    });
  }

  /**
   * Executes a POST request
   * @param {string} path - API path
   * @param {Object} [data={}] - Request data
   * @returns {Promise<Object>} Response data
   */
  async post(path, data = {}) {
    return this.request({ method: 'POST', path, data });
  }

  /**
   * Executes a GET request
   * @param {string} path - API path
   * @param {Object} [data={}] - Request data
   * @returns {Promise<Object>} Response data
   */
  async get(path, data = {}) {
    return this.request({ method: 'GET', path, data });
  }
}

module.exports = HttpClient;
