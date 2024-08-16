const RSA = require("../utils/RSAUtil");
const WApiHttpUtils = require('../utils/WASSHttpUtils');
const Cons = require('../utils/MpcConstants');

/**
 * Get Supported Networks
 * Get the ChainUp Custody supported networks and the opened networks in MPC workspace.
 */
exports.getOpenCoin = async function (reqData) {

    var respData = await WApiHttpUtils.request({
        url: Cons.openCoin,
        method: Cons.POST,
        requestData: reqData
    });
    return RSA.publicKeyDecrypt(JSON.parse(respData).data);
};
/**
 * Get MPC Workspace Coin Details
 * Get the details of MPC workspace's native tokens, and tokens supported
 */
exports.getCoinList = async function (reqData) {

    var respData = await WApiHttpUtils.request({
        url: Cons.coinList,
        method: Cons.POST,
        requestData: reqData
    });
    return RSA.publicKeyDecrypt(JSON.parse(respData).data);
};
/**
 * Get Latest Block Height
 * Get the latest block height of the specified network.
 */
exports.getChainHeight = async function (reqData) {

    var respData = await WApiHttpUtils.request({
        url: Cons.chainHeight,
        method: Cons.POST,
        requestData: reqData
    });
    return RSA.publicKeyDecrypt(JSON.parse(respData).data);
};

