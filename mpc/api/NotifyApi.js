/**
 * Notify API - MPC notification handling operations
 * Provides methods for decrypting MPC async notifications (webhooks)
 * @class NotifyApi
 * @extends MpcBaseApi
 */
const MpcBaseApi = require('./MpcBaseApi');

class NotifyApi extends MpcBaseApi {
  /**
   * Creates a new NotifyApi instance
   * @param {MpcConfig} config - MPC configuration object
   */
  constructor(config) {
    super(config);
  }

  /**
   * Decrypts deposit and withdrawal notification parameters
   * Used to decrypt encrypted notification data received from MPC callbacks
   * @param {string} cipher - Encrypted notification data
   * @returns {Object|null} Decrypted notification arguments, or null if decryption fails
   * @example
   * const notifyData = notifyApi.notifyRequest(encryptedData);
   * if (notifyData) {
   *   console.log('Notify type:', notifyData.side); // 'deposit' or 'withdraw'
   *   console.log('Sub wallet ID:', notifyData.sub_wallet_id);
   *   console.log('Symbol:', notifyData.symbol);
   *   console.log('Amount:', notifyData.amount);
   * }
   */
  async notifyRequest(cipher) {
    if (!cipher) {
      if (this.config.debug) {
        console.log('[MpcNotify] Cipher cannot be empty');
      }
      return null;
    }

    try {
      // Decrypt the cipher text using crypto provider
      const raw = this.cryptoProvider.decryptWithPublicKey(cipher);
      
      if (this.config.debug) {
        console.log('[MpcNotify] Decrypted data:', raw);
      }

      if (!raw) {
        console.error('[MpcNotify] Decrypt cipher returned null');
        return null;
      }

      // Parse JSON to notification arguments
      const notify = JSON.parse(raw);
      if (!notify) {
        console.error('[MpcNotify] JSON decode returned null');
        return null;
      }

      return notify;
    } catch (error) {
      console.error('[MpcNotify] Failed to decrypt notification:', error.message);
      return null;
    }
  }
}

module.exports = NotifyApi;
