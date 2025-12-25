/**
 * Default RSA Crypto Provider
 * Default implementation of ICryptoProvider using RSA encryption
 * Handles RSA encryption and decryption operations with node-rsa
 * Implements segment encryption/decryption for long data (matches Java SDK RSAHelper)
 * @class RsaCryptoProvider
 * @implements {ICryptoProvider}
 */
const crypto = require('crypto');
const ICryptoProvider = require('./ICryptoProvider');
const RSAUtil = require('./RSAUtil');

// RSA key size is 2048 bits = 256 bytes
// Max encrypt block = 256 - 11 (PKCS1 padding) = 245 bytes, but Java uses 234
const MAX_ENCRYPT_BLOCK = 234;
// Max decrypt block = 256 bytes
const MAX_DECRYPT_BLOCK = 256;

class RsaCryptoProvider extends ICryptoProvider {
  /**
   * Creates a new RSA crypto provider instance
   * @param {Object} options - Configuration options
   * @param {string} options.privateKey - RSA private key in PEM format
   * @param {string} options.publicKey - RSA public key in PEM format
   * @param {string} [options.charset='UTF-8'] - Character encoding
   */
  constructor(options) {
    super();
    // Auto-format RSA keys to proper PEM format
    this.privateKey = options.privateKey ? RSAUtil.formatRSAKey(options.privateKey, 'private') : '';
    this.publicKey = options.publicKey ? RSAUtil.formatRSAKey(options.publicKey, 'public') : '';
    this.charset = options.charset || 'UTF-8';
  }

  /**
   * Encrypts data using the private key with segment encryption
   * Matches Java SDK RSAHelper.encryptByPrivateKey() with segment encryption
   * @param {string} data - Data to encrypt
   * @returns {string} URL-safe base64 encoded encrypted data
   */
  encryptWithPrivateKey(data) {
    try {
      const dataBuffer = Buffer.from(data, 'utf-8');
      const inputLen = dataBuffer.length;
      const outputBuffers = [];
      let offset = 0;

      // Segment encryption: encrypt in blocks of MAX_ENCRYPT_BLOCK
      while (offset < inputLen) {
        const blockSize = Math.min(MAX_ENCRYPT_BLOCK, inputLen - offset);
        const chunk = dataBuffer.slice(offset, offset + blockSize);
        
        // Encrypt chunk with private key
        const encrypted = crypto.privateEncrypt(
          {
            key: this.privateKey,
            padding: crypto.constants.RSA_PKCS1_PADDING
          },
          chunk
        );
        
        outputBuffers.push(encrypted);
        offset += blockSize;
      }

      // Combine all encrypted chunks
      const combinedBuffer = Buffer.concat(outputBuffers);
      
      // Convert to URL-safe base64 (matches Java SDK Base64(true) which is URL-safe)
      const base64 = combinedBuffer.toString('base64');
      // Make URL-safe: replace + with -, / with _, remove trailing =
      const urlSafeBase64 = base64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      
      return urlSafeBase64;
    } catch (error) {
      throw new Error(`Failed to encrypt with private key: ${error.message}`);
    }
  }

  /**
   * Decrypts data using the public key with segment decryption
   * Matches Java SDK RSAHelper.decryptByPublicKey() with segment decryption
   * @param {string} encryptedData - URL-safe base64 encrypted data to decrypt
   * @returns {string} Decrypted data
   */
  decryptWithPublicKey(encryptedData) {
    try {
      // Convert URL-safe base64 back to standard base64
      let base64 = encryptedData
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      
      // Add padding if needed
      const padding = base64.length % 4;
      if (padding) {
        base64 += '='.repeat(4 - padding);
      }

      const encryptedBuffer = Buffer.from(base64, 'base64');
      const inputLen = encryptedBuffer.length;
      const outputBuffers = [];
      let offset = 0;

      // Segment decryption: decrypt in blocks of MAX_DECRYPT_BLOCK
      while (offset < inputLen) {
        const blockSize = Math.min(MAX_DECRYPT_BLOCK, inputLen - offset);
        const chunk = encryptedBuffer.slice(offset, offset + blockSize);
        
        // Decrypt chunk with public key
        const decrypted = crypto.publicDecrypt(
          {
            key: this.publicKey,
            padding: crypto.constants.RSA_PKCS1_PADDING
          },
          chunk
        );
        
        outputBuffers.push(decrypted);
        offset += blockSize;
      }

      // Combine all decrypted chunks
      const combinedBuffer = Buffer.concat(outputBuffers);
      return combinedBuffer.toString('utf-8');
    } catch (error) {
      throw new Error(`Failed to decrypt with public key: ${error.message}`);
    }
  }
}

module.exports = RsaCryptoProvider;
