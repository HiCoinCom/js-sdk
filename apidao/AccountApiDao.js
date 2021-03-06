const RSA = require("../utils/RSAUtil");
const WApiHttpUtils = require('../utils/WASSHttpUtils');
const Cons = require('../utils/Constants');

/**
 * 获取用户指定币账户
 */
exports.getByUidAndSymbol = async function (reqData) {

    var respData = await WApiHttpUtils.request({
        url: Cons.getByUidAndSymbol,
        method: Cons.POST,
        requestData: reqData
    });
    return RSA.publicKeyDecrypt(JSON.parse(respData).data);
};
/**
 * 获取商户归集账户余额
 */
exports.getCompanyBySymbol = async function (reqData) {

    var respData = await WApiHttpUtils.request({
        url: Cons.getCompanyBySymbol,
        method: Cons.POST,
        requestData: reqData
    });
    return RSA.publicKeyDecrypt(JSON.parse(respData).data);
};
/**
 * 获取用户指定币账户地址
 */
exports.getDepositAddress = async function (reqData) {

    var respData = await WApiHttpUtils.request({
        url: Cons.getDepositAddress,
        method: Cons.POST,
        requestData: reqData
    });
    return RSA.publicKeyDecrypt(JSON.parse(respData).data);
};

