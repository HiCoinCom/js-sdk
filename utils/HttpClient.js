/**
 * HTTP Client Class
 * Handles HTTP communication with the WaaS API
 * Provides methods for making HTTP requests with proper error handling
 * Uses Node.js built-in https/http modules (no deprecated dependencies)
 * @class HttpClient
 */
const https = require('https');
const http = require('http');
const { URL } = require('url');
const querystring = require('querystring');

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

    let url = this.config.getUrl(path);
    
    // For GET requests, append query string
    if (method === 'GET' && Object.keys(data).length > 0) {
      const queryStr = querystring.stringify(data);
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
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...headers,
      },
      timeout: 30000, // 30 seconds timeout
    };

    // Prepare POST body
    let postData = '';
    if (method === 'POST') {
      postData = querystring.stringify(data);
      requestOptions.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    if (this.config.debug) {
      console.log('[HTTP Request]:', {
        method,
        url,
        data,
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
            reject(new Error(`HTTP ${response.statusCode}: ${body}`));
            return;
          }

          if (this.config.debug) {
            console.log('[HTTP Response]:', body);
          }

          resolve(body);
        });
      });

      req.on('error', (error) => {
        reject(new Error(`HTTP request failed: ${error.message}`));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('HTTP request timeout'));
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
