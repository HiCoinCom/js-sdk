const RSA = require("../utils/RSAUtil");
const WApiHttpUtils = require('../utils/WASSHttpUtils');
const Cons = require('../utils/MpcConstants');



/**
 * Get NFT Information
 * Retrieve NFT data such as images and names.
 *
 */
exports.getNftInfo = async function (reqData) {

    var respData = await WApiHttpUtils.request({
        url: Cons.nftInfo,
        method: Cons.POST,
        requestData: reqData
    });
    return RSA.publicKeyDecrypt(JSON.parse(respData).data);
};