/**
 *  Asynchronous callback notification related api (interface provided to waas)
 */
const RSA = require('../utils/RSAUtil');

/**
 *  Decrypt user deposit asynchronous callback notification request parameters
 * @param cipher
 */
exports.decodeNotifyRequest = function (cipher) {
    try {
        cipher = (typeof cipher == 'string') ? cipher : JSON.stringify(cipher);
        if (cipher == 'null' || cipher.trim().length == 0) {
            return 'VerifyRequest cipher can not be empty!'
        }
        return RSA.publicKeyDecrypt(cipher);
    } catch (e) {
        console.error(e)
    }
};

