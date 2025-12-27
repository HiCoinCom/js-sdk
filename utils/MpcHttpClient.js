/**
 * MPC HTTP Client Class
 * Handles HTTP communication with the MPC API
 * Implements the same request format as Java SDK:
 * - Request params: app_id + data (encrypted with private key)
 * - Response data: encrypted with private key, decrypt with public key
 * Uses Node.js built-in https/http modules (no deprecated dependencies)
 * @class MpcHttpClient
 */
const https = require('https');
const http = require('http');
const { URL } = require('url');
const querystring = require('querystring');

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

    let url = this.config.getUrl(path);

    // Only two parameters: app_id and data (encrypted)
    // This matches Java SDK: Args params = new Args(this.cfg.getAppId(), data);
    const params = {
      app_id: this.config.appId,
      data: encryptedData
    };

    // For GET requests, append query string
    if (method === 'GET') {
      const queryStr = querystring.stringify(params);
      url = url + (url.includes('?') ? '&' : '?') + queryStr;
    }

    const parsedUrl = new URL(url);
    const isHttps = parsedUrl.protocol === 'https:';
    const transport = isHttps ? https : http;

    const requestOptions = {
      method,
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      headers: {},
      timeout: 30000, // 30 seconds timeout
    };

    // Prepare POST body
    let postData = '';
    if (method === 'POST') {
      postData = querystring.stringify(params);
      requestOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      requestOptions.headers['Content-Length'] = Buffer.byteLength(postData);
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
      const req = transport.request(requestOptions, (response) => {
        let body = '';
        
        response.on('data', (chunk) => {
          body += chunk;
        });
        
        response.on('end', () => {
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

      req.on('error', (error) => {
        reject(new Error(`MPC HTTP request failed: ${error.message}`));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('MPC HTTP request timeout'));
      });

      // Send POST data
      if (method === 'POST' && postData) {
        req.write(postData);
      }
      
      req.end();
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
