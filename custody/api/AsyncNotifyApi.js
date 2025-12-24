/**
 * Async Notify API - Asynchronous notification management
 * Provides methods for decrypting and managing webhook notifications
 * @class AsyncNotifyApi
 * @extends BaseApi
 */
const BaseApi = require('./BaseApi');

class AsyncNotifyApi extends BaseApi {
  /**
   * Creates a new AsyncNotifyApi instance
   * @param {WaasConfig} config - WaaS configuration object
   */
  constructor(config) {
    super(config);
  }

  /**
   * Decrypts deposit and withdrawal notification parameters
   * Used to decrypt encrypted notification data received from WaaS callbacks
   * @param {string} cipher - Encrypted notification data
   * @returns {Object|null} Decrypted notification arguments, or null if decryption fails
   * @example
   * const notifyData = asyncNotifyApi.notifyRequest(encryptedData);
   * if (notifyData) {
   *   console.log('Notify type:', notifyData.side); // 'deposit' or 'withdraw'
   * }
   */
  notifyRequest(cipher) {
    if (!cipher) {
      if (this.config.debug) {
        console.log('[AsyncNotify] Cipher cannot be empty');
      }
      return null;
    }

    try {
      // Decrypt the cipher text using public key
      const raw = this.cryptoProvider.decryptWithPublicKey(cipher);
      
      if (this.config.debug) {
        console.log('[AsyncNotify] Decrypted data:', raw);
      }

      if (!raw) {
        console.error('[AsyncNotify] Decrypt cipher returned null');
        return null;
      }

      // Parse JSON to notification arguments
      const notify = JSON.parse(raw);
      if (!notify) {
        console.error('[AsyncNotify] JSON decode returned null');
        return null;
      }

      return notify;
    } catch (error) {
      console.error('[AsyncNotify] Failed to decrypt notification:', error.message);
      return null;
    }
  }

  /**
   * Decrypts withdrawal secondary verification request parameters
   * Used to decrypt verification request data for withdrawal operations
   * that require additional confirmation
   * @param {string} cipher - Encrypted verification request data
   * @returns {Object|null} Decrypted withdrawal arguments, or null if decryption fails
   * @example
   * const withdrawData = asyncNotifyApi.verifyRequest(encryptedData);
   * if (withdrawData) {
   *   console.log('Withdraw request:', withdrawData.request_id);
   * }
   */
  verifyRequest(cipher) {
    if (!cipher) {
      if (this.config.debug) {
        console.log('[AsyncNotify] VerifyRequest cipher cannot be empty');
      }
      return null;
    }

    try {
      // Decrypt the cipher text
      const raw = this.cryptoProvider.decryptWithPublicKey(cipher);
      
      if (this.config.debug) {
        console.log('[AsyncNotify] VerifyRequest decrypted data:', raw);
      }

      if (!raw) {
        console.error('[AsyncNotify] VerifyRequest decrypt returned null');
        return null;
      }

      // Parse JSON to withdrawal arguments
      const withdraw = JSON.parse(raw);
      if (!withdraw) {
        console.error('[AsyncNotify] VerifyRequest JSON decode returned null');
        return null;
      }

      return withdraw;
    } catch (error) {
      console.error('[AsyncNotify] Failed to decrypt verify request:', error.message);
      return null;
    }
  }

  /**
   * Encrypts the secondary verification withdrawal response data
   * Used to encrypt the response data when confirming or rejecting
   * a withdrawal that requires secondary verification
   * @param {Object} withdraw - Withdrawal arguments to encrypt
   * @returns {string|null} Encrypted response data, or null if encryption fails
   * @example
   * const responseData = asyncNotifyApi.verifyResponse({
   *   request_id: 'xxx',
   *   status: 1 // 1=approve, 2=reject
   * });
   */
  verifyResponse(withdraw) {
    if (!withdraw) {
      console.error('[AsyncNotify] VerifyResponse withdraw cannot be empty');
      return null;
    }

    try {
      // Convert to JSON string
      const withdrawJson = JSON.stringify(withdraw);

      // Encrypt with private key
      const raw = this.cryptoProvider.encryptWithPrivateKey(withdrawJson);
      
      if (!raw) {
        console.error('[AsyncNotify] VerifyResponse encrypt returned null');
        return null;
      }

      return raw;
    } catch (error) {
      console.error('[AsyncNotify] Failed to encrypt verify response:', error.message);
      return null;
    }
  }
}

module.exports = AsyncNotifyApi;
