const RSA = require("../utils/RSAUtil");
const WApiHttpUtils = require('../utils/WASSHttpUtils');
const Cons = require('../utils/MpcConstants');



/**
 * Create Web3 Transaction
 * Create a Web3 transaction through the API
 */
exports.createWeb3Trans = async function (reqData) {

    var respData = await WApiHttpUtils.request({
        url: Cons.createWeb3Trans,
        method: Cons.POST,
        requestData: reqData
    });
    return RSA.publicKeyDecrypt(JSON.parse(respData).data);
};


/**
 * Web3 Transaction Speed Up
 * When a transfer is signed but has not been confirmed
 * on the blockchain for a long time, it can be speed up by specifying a higher fee.
 */
exports.web3Pending = async function (reqData) {

    var respData = await WApiHttpUtils.request({
        url: Cons.web3Pending,
        method: Cons.POST,
        requestData: reqData
    });
    return RSA.publicKeyDecrypt(JSON.parse(respData).data);
};


/**
 * Get Web3 Transaction Records
 * Get the Web3 transaction records of all wallets under the workspace with a specific ID
 */
exports.web3TransList = async function (reqData) {

    var respData = await WApiHttpUtils.request({
        url: Cons.web3TransList,
        method: Cons.POST,
        requestData: reqData
    });
    return RSA.publicKeyDecrypt(JSON.parse(respData).data);
};

/**
 * Sync Web3 Transaction Records
 * Get all Web3 transaction records under a wallet
 *
 */
exports.web3SyncTransList = async function (reqData) {

    var respData = await WApiHttpUtils.request({
        url: Cons.web3SyncTransList,
        method: Cons.POST,
        requestData: reqData
    });
    return RSA.publicKeyDecrypt(JSON.parse(respData).data);
};