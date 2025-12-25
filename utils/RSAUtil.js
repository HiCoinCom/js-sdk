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
 * @param {boolean} [preserveFormat=false] - If true, preserve original key format (PKCS#1 vs PKCS#8); if false, convert to PKCS#1
 * @returns {string} Properly formatted PEM key
 */
exports.formatRSAKey = function (key, type = 'private', preserveFormat = false) {
    if (!key) return key;
    
    // Detect original format before cleaning
    let isPkcs8 = false;
    
    if (preserveFormat) {
        // Check header first
        if (key.includes('BEGIN PRIVATE KEY') && !key.includes('BEGIN RSA PRIVATE KEY')) {
            isPkcs8 = true;
        } else if (key.includes('BEGIN RSA PRIVATE KEY')) {
            isPkcs8 = false;
        } else if (type === 'private') {
            // No header found, try to detect from ASN.1 structure
            // PKCS#8 starts with SEQUENCE containing version and AlgorithmIdentifier
            // PKCS#1 starts with SEQUENCE containing version (INTEGER)
            try {
                const cleanBase64 = key.replace(/\s+/g, '');
                const decoded = Buffer.from(cleanBase64, 'base64');
                // PKCS#8 private key starts with: 30 82 xx xx 02 01 00 30 0d 06 09...
                // PKCS#1 private key starts with: 30 82 xx xx 02 01 00 02 82...
                // Check if it has AlgorithmIdentifier (OID 1.2.840.113549.1.1.1 for RSA)
                // The byte sequence "06 09 2a 86 48 86 f7 0d 01 01 01" indicates PKCS#8
                const hexStr = decoded.toString('hex');
                if (hexStr.includes('06092a864886f70d010101')) {
                    isPkcs8 = true;
                }
            } catch (e) {
                // If detection fails, default to PKCS#1
                isPkcs8 = false;
            }
        }
    }
    
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
        if (isPkcs8) {
            return `-----BEGIN PRIVATE KEY-----\n${formattedKey}\n-----END PRIVATE KEY-----`;
        } else {
            return `-----BEGIN RSA PRIVATE KEY-----\n${formattedKey}\n-----END RSA PRIVATE KEY-----`;
        }
    } else {
        return `-----BEGIN PUBLIC KEY-----\n${formattedKey}\n-----END PUBLIC KEY-----`;
    }
};

/**
 * @deprecated Use formatRSAKey(key, type, true) instead
 * Normalize RSA key to proper PEM format while preserving original format type
 * This function preserves the original key format (PKCS#1 vs PKCS#8)
 * @param {string} key - RSA key (with or without headers/line breaks)
 * @param {string} type - Key type: 'private' or 'public'
 * @returns {string} Properly formatted PEM key preserving original format
 */
exports.normalizeRSAKey = function (key, type = 'private') {
    return exports.formatRSAKey(key, type, true);
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