/**
 * Crypto Provider Interface
 * Defines the contract for encryption and decryption operations
 * Allows custom implementations for different encryption strategies
 * @interface ICryptoProvider
 */
class ICryptoProvider {
  /**
   * Encrypts data using the private key
   * Used for signing outgoing requests
   * @param {string} data - Data to encrypt
   * @returns {string} Encrypted data (typically base64 encoded)
   * @abstract
   */
  encryptWithPrivateKey(data) {
    throw new Error('Method "encryptWithPrivateKey" must be implemented');
  }

  /**
   * Decrypts data using the public key
   * Used for verifying and decoding responses from server
   * @param {string} encryptedData - Encrypted data to decrypt
   * @returns {string} Decrypted data
   * @abstract
   */
  decryptWithPublicKey(encryptedData) {
    throw new Error('Method "decryptWithPublicKey" must be implemented');
  }

  /**
   * Signs data (alias for encryptWithPrivateKey)
   * @param {string} data - Data to sign
   * @returns {string} Signature
   * @abstract
   */
  sign(data) {
    return this.encryptWithPrivateKey(data);
  }

  /**
   * Verifies signature (alias for decryptWithPublicKey)
   * @param {string} signature - Signature to verify
   * @returns {string} Verified data
   * @abstract
   */
  verify(signature) {
    return this.decryptWithPublicKey(signature);
  }
}

module.exports = ICryptoProvider;
