const RSA = require("../utils/RSAUtil");
const WApiHttpUtils = require('../utils/WASSHttpUtils');
const Cons = require('../utils/MpcConstants');


/**
 * Get Auto-Sweep Wallets
 * Retrieve the auto-sweep wallet and auto fueling wallet for a specific coin.
 */
exports.getAutoCollectSubWallets = async function (reqData) {

    var respData = await WApiHttpUtils.request({
        url: Cons.getAutoCollectSubWallets,
        method: Cons.POST,
        requestData: reqData
    });
    return RSA.publicKeyDecrypt(JSON.parse(respData).data);
};

/**
 * Configure Auto-Sweep for Coin
 * Set the minimum auto-sweep amount and the maximum miner fee for refueling.
 */
exports.setAutoCollectSymbols = async function (reqData) {

    var respData = await WApiHttpUtils.request({
        url: Cons.setAutoCollectSymbols,
        method: Cons.POST,
        requestData: reqData
    });
    return RSA.publicKeyDecrypt(JSON.parse(respData).data);
};

/**
 * Sync Auto Sweeping Records
 * Retrieve up to 100 sweeping records after a specific transaction ID for all wallets under the workspace
 *
 */
exports.syncAutoCollectList = async function (reqData) {

    var respData = await WApiHttpUtils.request({
        url: Cons.syncAutoCollectList,
        method: Cons.POST,
        requestData: reqData
    });
    return RSA.publicKeyDecrypt(JSON.parse(respData).data);
};