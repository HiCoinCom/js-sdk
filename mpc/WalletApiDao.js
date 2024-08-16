const RSA = require("../utils/RSAUtil");
const WApiHttpUtils = require('../utils/WASSHttpUtils');
const Cons = require('../utils/MpcConstants');



/**
 * Create wallet
 * Pass in the specified wallet name to create a new wallet for the MPC workspace
 */
exports.createSubWallet = async function (reqData) {

    var respData = await WApiHttpUtils.request({
        url: Cons.createSubWallet,
        method: Cons.POST,
        requestData: reqData
    });
    return RSA.publicKeyDecrypt(JSON.parse(respData).data);
};


/**
 * Create Wallet Address
 * Create an address for a specified coin; a single wallet can create multiple coin addresses, and multiple Memos will be created for the Memo type.
 */
exports.createAddress = async function (reqData) {

    var respData = await WApiHttpUtils.request({
        url: Cons.createAddress,
        method: Cons.POST,
        requestData: reqData
    });
    return RSA.publicKeyDecrypt(JSON.parse(respData).data);
};

/**
 * Query Wallet Address
 * List of wallet addresses
 */
exports.addressList = async function (reqData) {

    var respData = await WApiHttpUtils.request({
        url: Cons.addressList,
        method: Cons.POST,
        requestData: reqData
    });
    return RSA.publicKeyDecrypt(JSON.parse(respData).data);
};

/**
 * Get Wallet Assets
 * Get the account assets under the specified wallet and coin.
 */
exports.subWalletAssets = async function (reqData) {

    var respData = await WApiHttpUtils.request({
        url: Cons.subWalletAssets,
        method: Cons.POST,
        requestData: reqData
    });
    return RSA.publicKeyDecrypt(JSON.parse(respData).data);
};

/**
 * Modify the Wallet Display Status
 * You can specify whether the wallet is displayed on the user side.
 * If set to display, the wallet will be displayed on the user side,
 * including the App and PC systems, and manual operations can be performed;
 * if it is set to not display,
 * the wallet will not be displayed on the user side and can only be operated via OpenAPI.
 */
exports.changeShowStatus = async function (reqData) {

    var respData = await WApiHttpUtils.request({
        url: Cons.changeShowStatus,
        method: Cons.POST,
        requestData: reqData
    });
    return RSA.publicKeyDecrypt(JSON.parse(respData).data);
};

/**
 * Verify Address Information
 * Input a specific address and get the response of the
 * corresponding custody user and coin information
 */
exports.addressInfo = async function (reqData) {

    var respData = await WApiHttpUtils.request({
        url: Cons.addressInfo,
        method: Cons.POST,
        requestData: reqData
    });
    return RSA.publicKeyDecrypt(JSON.parse(respData).data);
};