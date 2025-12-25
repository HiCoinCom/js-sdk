const RSAUtil = require('./RSAUtil');

exports.DEBUG = false;
exports.UTF8 = 'utf8';

//about the http
exports.HOST = "";
exports.VER = '/api/v2';
exports.GET = 'GET';
exports.POST = 'POST';
exports.app_id = '';

// RSA keys
exports.privateKey = '';
exports.hiCoinPubKey = '';

// Method to set and auto-format keys
exports.setPrivateKey = function(key) {
    this.privateKey = key ? RSAUtil.formatRSAKey(key, 'private') : '';
};

exports.setPublicKey = function(key) {
    this.hiCoinPubKey = key ? RSAUtil.formatRSAKey(key, 'public') : '';
};

//User-related operations
exports.createUser = "/user/createUser";
exports.registerEmail = "/user/registerEmail";
exports.getUserInfo = "/user/info";
exports.getCoinList = "/user/getCoinList";

//Account related operations api
exports.getDepositAddress = "/account/getDepositAddress";
exports.getByUidAndSymbol = "/account/getByUidAndSymbol";
exports.getCompanyBySymbol = "/account/getCompanyBySymbol";

exports.transfer="/account/transfer";
exports.getTransferList="/account/transferList";
exports.syncTransferList="/account/syncTransferList";


//Deposit-related operations api
exports.syncDepositList = "/billing/syncDepositList";
exports.getDepositList = "/billing/depositList";
exports.syncMinerFeeList = "/billing/syncMinerFeeList";
exports.minerFeeList = "/billing/minerFeeList";
exports.withdraw = "/billing/withdraw";
exports.syncWithdrawList = "/billing/syncWithdrawList";
exports.getWithdrawList = "/billing/withdrawList";

exports.privateKey = "";
exports.hiCoinPubKey = "";


exports.setPrivateKey = function (pKey) {
    if (pKey.startsWith('-----BEGIN PRIVATE KEY-----') && pKey.endsWith('-----END PRIVATE KEY-----')) {
        this.privateKey = pKey;
    } else {
        this.privateKey = '-----BEGIN PRIVATE KEY-----' + pKey + '-----END PRIVATE KEY-----';
    }
};

exports.setPubKey = function (pKey) {
    if (pKey.startsWith('-----BEGIN PUBLIC KEY-----') && pKey.endsWith('-----BEGIN PUBLIC KEY-----')) {
        this.privateKey = pKey;
    } else {
        this.hiCoinPubKey = '-----BEGIN PUBLIC KEY-----' + pKey + '-----END PUBLIC KEY-----';
    }
};

exports.setHost = function (host) {
    this.HOST = host;
};

exports.setAppId = function (appId) {
    this.app_id = appId;
};
exports.setDebug = function (debug) {
    this.DEBUG = debug;
};

