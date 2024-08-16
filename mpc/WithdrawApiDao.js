const RSA = require("../utils/RSAUtil");
const WApiHttpUtils = require('../utils/WASSHttpUtils');
const Cons = require('../utils/MpcConstants');



/**
 * Transfer (Withdrawal)
 * Initiate a transfer through the API
 */
exports.withdraw = async function (reqData) {

    var respData = await WApiHttpUtils.request({
        url: Cons.withdraw,
        method: Cons.POST,
        requestData: reqData
    });
    return RSA.publicKeyDecrypt(JSON.parse(respData).data);
};


/**
 * Get Transfer Records
 * Get all wallet transfer records after a specific transaction
 * ID for all wallets under the workspace
 */
exports.withdrawList = async function (reqData) {

    var respData = await WApiHttpUtils.request({
        url: Cons.withdrawList,
        method: Cons.POST,
        requestData: reqData
    });
    return RSA.publicKeyDecrypt(JSON.parse(respData).data);
};


/**
 * Synchronize Transfer Records
 * Get the transfer records after a specific transaction ID
 * for all wallets under the workspace
 */
exports.syncWithdrawList = async function (reqData) {

    var respData = await WApiHttpUtils.request({
        url: Cons.syncWithdrawList,
        method: Cons.POST,
        requestData: reqData
    });
    return RSA.publicKeyDecrypt(JSON.parse(respData).data);
};