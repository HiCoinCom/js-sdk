const RSA = require("../utils/RSAUtil");
const WApiHttpUtils = require('../utils/WASSHttpUtils');
const Cons = require('../utils/MpcConstants');



/**
 * Get Receiving records
 * Get all wallet receiving records under the workspace
 */
exports.getDepositList = async function (reqData) {

    var respData = await WApiHttpUtils.request({
        url: Cons.depositList,
        method: Cons.POST,
        requestData: reqData
    });
    return RSA.publicKeyDecrypt(JSON.parse(respData).data);
};


/**
 * Sync Receiving record
 * Get all wallet receiving records under the workspace
 */
exports.syncDepositList = async function (reqData) {

    var respData = await WApiHttpUtils.request({
        url: Cons.syncDepositList,
        method: Cons.POST,
        requestData: reqData
    });
    return RSA.publicKeyDecrypt(JSON.parse(respData).data);
};