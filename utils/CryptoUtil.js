/**
 * Crypto Utility Class
 * Handles RSA encryption and decryption operations
 * Provides methods for request signing and response verification
 * @class CryptoUtil
 */
const NodeRSA = require('node-rsa');
const URLSafeBase64 = require('urlsafe-base64');

class CryptoUtil {
  /**
   * Creates a new CryptoUtil instance
   * @param {WaasConfig} config - WaaS configuration containing keys
   */
  constructor(config) {
    this.config = config;
    this.privateKeyInstance = null;
    this.publicKeyInstance = null;
  }

  /**
   * Gets or initializes the private key instance
   * @returns {NodeRSA} Private key instance
   * @private
   */
  getPrivateKeyInstance() {
    if (!this.privateKeyInstance) {
      this.privateKeyInstance = new NodeRSA(this.config.privateKey, 'pkcs8-private');
    }
    return this.privateKeyInstance;
  }

  /**
   * Gets or initializes the public key instance
   * @returns {NodeRSA} Public key instance
   * @private
   */
  getPublicKeyInstance() {
    if (!this.publicKeyInstance) {
      this.publicKeyInstance = new NodeRSA(this.config.publicKey);
    }
    return this.publicKeyInstance;
  }

  /**
   * Encrypts data using the private key
   * Used for signing outgoing requests
   * @param {string} data - Data to encrypt
   * @returns {string} URL-safe base64 encoded encrypted data
   */
  encryptWithPrivateKey(data) {
    try {
      const privateKey = this.getPrivateKeyInstance();
      const encrypted = privateKey.encryptPrivate(data, 'base64');
      return URLSafeBase64.encode(encrypted);
    } catch (error) {
      throw new Error(`Failed to encrypt with private key: ${error.message}`);
    }
  }

  /**
   * Decrypts data using the public key
   * Used for verifying and decoding responses from server
   * @param {string} encryptedData - Encrypted data to decrypt
   * @returns {string} Decrypted data
   */
  decryptWithPublicKey(encryptedData) {
    try {
      const publicKey = this.getPublicKeyInstance();
      return publicKey.decryptPublic(encryptedData, this.config.charset);
    } catch (error) {
      throw new Error(`Failed to decrypt with public key: ${error.message}`);
    }
  }

  /**
   * Signs data with the private key (alias for encryptWithPrivateKey)
   * @param {string} data - Data to sign
   * @returns {string} Signature
   */
  sign(data) {
    return this.encryptWithPrivateKey(data);
  }

  /**
   * Verifies signature using public key (alias for decryptWithPublicKey)
   * @param {string} signature - Signature to verify
   * @returns {string} Verified data
   */
  verify(signature) {
    return this.decryptWithPublicKey(signature);
  }
}

module.exports = CryptoUtil;
