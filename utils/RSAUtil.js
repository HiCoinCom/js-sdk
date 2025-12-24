/**
 * RSA encryption algorithm encapsulation，
 * Provide encryption and decryption to the outside world
 */
const NodeRSA = require("node-rsa");
const Cons = require("./Constants");
const URLSafeBase64 = require('urlsafe-base64');

/**
 * Format RSA key to PEM format with proper headers and line breaks
 * Supports both private and public keys
 * @param {string} key - RSA key (with or without headers/line breaks)
 * @param {string} type - Key type: 'private' or 'public'
 * @returns {string} Properly formatted PEM key
 */
exports.formatRSAKey = function (key, type = 'private') {
    if (!key) return key;
    
    // Remove all whitespace and newlines
    let cleanKey = key.replace(/\s+/g, '');
    
    // Remove existing headers if present
    cleanKey = cleanKey
        .replace(/-----BEGIN\s*(RSA\s*)?(PRIVATE|PUBLIC)\s*KEY-----/g, '')
        .replace(/-----END\s*(RSA\s*)?(PRIVATE|PUBLIC)\s*KEY-----/g, '');
    
    // Add line breaks every 64 characters
    const formattedKey = cleanKey.match(/.{1,64}/g).join('\n');
    
    // Add appropriate headers
    if (type === 'private') {
        return `-----BEGIN RSA PRIVATE KEY-----\n${formattedKey}\n-----END RSA PRIVATE KEY-----`;
    } else {
        return `-----BEGIN PUBLIC KEY-----\n${formattedKey}\n-----END PUBLIC KEY-----`;
    }
};

/**
 * encrypt by private key
 */
exports.privateKeyEncrypt = function (data) {
    var nodeRasPublic = new NodeRSA(Cons.privateKey, 'pkcs8-private');
    var encryData = nodeRasPublic.encryptPrivate(data, 'base64');
    //URL safe encode
    return URLSafeBase64.encode(encryData);
};

/**
 * decrypt by public  key
 */
exports.publicKeyDecrypt = function (data) {
    var nodeRasPublic = new NodeRSA(Cons.hiCoinPubKey);
    return nodeRasPublic.decryptPublic(data, Cons.UTF8);
};