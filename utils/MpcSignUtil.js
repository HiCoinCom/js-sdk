/**
 * MPC Signature Utility
 * Provides signature generation for MPC withdrawal and Web3 transactions
 * @module MpcSignUtil
 */

const crypto = require('crypto');
const NodeRSA = require('node-rsa');

class MpcSignUtil {
  /**
   * Generates signature for MPC withdrawal
   * @param {Object} withdrawParams - Withdrawal parameters
   * @param {string} withdrawParams.request_id - Request ID
   * @param {string} withdrawParams.sub_wallet_id - Sub-wallet ID  
   * @param {string} withdrawParams.symbol - Coin symbol
   * @param {string} withdrawParams.address_to - Destination address
   * @param {string} withdrawParams.amount - Withdrawal amount
   * @param {string} [withdrawParams.memo] - Address memo
   * @param {string} [withdrawParams.outputs] - UTXO outputs
   * @param {string} signPrivateKey - RSA private key for signing
   * @returns {string} Base64 encoded signature
   */
  static generateWithdrawSign(withdrawParams, signPrivateKey) {
    if (!withdrawParams || !signPrivateKey) {
      return '';
    }

    const signParamsMap = {
      request_id: withdrawParams.request_id,
      sub_wallet_id: withdrawParams.sub_wallet_id,
      symbol: withdrawParams.symbol,
      address_to: withdrawParams.address_to,
      amount: withdrawParams.amount,
      memo: withdrawParams.memo,
      outputs: withdrawParams.outputs
    };

    const signData = this.paramsSort(signParamsMap);
    if (!signData) {
      return '';
    }

    return this.sign(signData, signPrivateKey);
  }

  /**
   * Generates signature for Web3 transaction
   * @param {Object} web3Params - Web3 transaction parameters
   * @param {string} web3Params.request_id - Request ID
   * @param {string} web3Params.sub_wallet_id - Sub-wallet ID
   * @param {string} web3Params.main_chain_symbol - Main chain symbol
   * @param {string} web3Params.interactive_contract - Interactive contract address
   * @param {string} web3Params.amount - Transaction amount
   * @param {string} web3Params.input_data - Input data
   * @param {string} signPrivateKey - RSA private key for signing
   * @returns {string} Base64 encoded signature
   */
  static generateWeb3Sign(web3Params, signPrivateKey) {
    if (!web3Params || !signPrivateKey) {
      return '';
    }

    const signParamsMap = {
      request_id: web3Params.request_id,
      sub_wallet_id: web3Params.sub_wallet_id,
      main_chain_symbol: web3Params.main_chain_symbol,
      interactive_contract: web3Params.interactive_contract,
      amount: web3Params.amount,
      input_data: web3Params.input_data
    };

    const signData = this.paramsSort(signParamsMap);
    if (!signData) {
      return '';
    }

    return this.sign(signData, signPrivateKey);
  }

  /**
   * Sorts parameters and formats them for signing
   * Rules:
   * - Parameters are formatted as k1=v1&k2=v2
   * - Keys are sorted in ASCII ascending order
   * - Empty values are excluded from signature
   * - Numeric values must not end with 0 (e.g., 1.0001000 becomes 1.0001)
   * - Result is converted to lowercase
   * 
   * @param {Object} params - Parameters to sort
   * @returns {string} Sorted and formatted parameter string
   */
  static paramsSort(params) {
    if (!params) {
      return '';
    }

    const sortedParams = {};

    // Process each parameter
    for (const key of Object.keys(params)) {
      let value = params[key];

      // Skip empty values
      if (value === null || value === undefined || value === '') {
        continue;
      }

      // Convert to string
      value = String(value);

      // Remove trailing zeros from numeric amounts
      if (key === 'amount' && value) {
        // Use regex to remove trailing zeros after decimal point
        value = value.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
      }

      sortedParams[key] = value;
    }

    // Sort keys in ASCII order (TreeMap equivalent)
    const sortedKeys = Object.keys(sortedParams).sort();

    // Build the parameter string
    const parts = [];
    for (const key of sortedKeys) {
      parts.push(`${key}=${sortedParams[key]}`);
    }

    // Join with & and convert to lowercase
    return parts.join('&').toLowerCase();
  }

  /**
   * Signs data using RSA private key with SHA256
   * Process:
   * 1. Convert sorted params to lowercase
   * 2. Generate MD5 hash of the params string
   * 3. Sign the MD5 hash with RSA-SHA256
   * 4. Return Base64 encoded signature
   * 
   * @param {string} signData - Data to sign (sorted parameters string)
   * @param {string} signPrivateKey - RSA private key (PEM format)
   * @returns {string} Base64 encoded signature
   */
  static sign(signData, signPrivateKey) {
    if (!signData || !signPrivateKey) {
      return '';
    }

    try {
      // Step 1: Generate MD5 hash of the data
      const md5Hash = crypto.createHash('md5').update(signData, 'utf8').digest('hex');

      // Step 2: Detect key format and load appropriately
      // PKCS#1: -----BEGIN RSA PRIVATE KEY-----
      // PKCS#8: -----BEGIN PRIVATE KEY-----
      let key;
      if (signPrivateKey.includes('BEGIN RSA PRIVATE KEY')) {
        // PKCS#1 format
        key = new NodeRSA(signPrivateKey, 'pkcs1');
      } else if (signPrivateKey.includes('BEGIN PRIVATE KEY')) {
        // PKCS#8 format
        key = new NodeRSA(signPrivateKey, 'pkcs8');
      } else {
        // Try auto-detection by NodeRSA
        key = new NodeRSA(signPrivateKey);
      }
      key.setOptions({ signingScheme: 'sha256' });
      
      // Step 3: Sign the MD5 hash with RSA-SHA256
      const signature = key.sign(Buffer.from(md5Hash, 'utf8'), 'base64');
      return signature;
    } catch (error) {
      console.error('MPC sign error:', error.message);
      return '';
    }
  }

  /**
   * Calculates MD5 hash of a string
   * @param {string} data - Data to hash
   * @returns {string} MD5 hash in hexadecimal
   */
  static md5(data) {
    return crypto.createHash('md5').update(data, 'utf8').digest('hex');
  }
}

module.exports = MpcSignUtil;
