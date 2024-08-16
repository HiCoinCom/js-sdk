exports.DEBUG = false;
exports.UTF8 = 'utf8';

//about the http
exports.HOST = "https://openapi.chainup.com";
exports.VER = '/api/mpc';
exports.GET = 'GET';
exports.POST = 'POST';
exports.app_id = '';

//WorkSpace
exports.openCoin = "/api/mpc/wallet/open_coin";
exports.coinList = "/api/mpc/coin_list";
exports.chainHeight = "/api/mpc/chain_height";

//Wallet
exports.createSubWallet = "/api/mpc/sub_wallet/create";
exports.createAddress = "/api/mpc/sub_wallet/create/address";
exports.addressList = "/api/mpc/sub_wallet/get/address/list";
exports.subWalletAssets = "/api/mpc/sub_wallet/assets";
exports.changeShowStatus = "/api/mpc/sub_wallet/change_show_status";
exports.addressInfo = "/api/mpc/sub_wallet/address/info";


//Withdraw
exports.withdraw = "/api/mpc/billing/withdraw";
exports.withdrawList = "/api/mpc/billing/withdraw_list";
exports.syncWithdrawList = "/api/mpc/billing/sync_withdraw_list";

//Deposit
exports.depositList = "/api/mpc/billing/deposit_list";
exports.syncDepositList = "/api/mpc/billing/sync_deposit_list";
//AutoSweep
exports.getAutoCollectSubWallets = "/api/mpc/auto_collect/sub_wallets";
exports.setAutoCollectSymbols = "/api/mpc/billing/auto_collect/symbol/set";
exports.syncAutoCollectList = "/api/mpc/billing/sync_auto_collect_list";
//web3Transaction
exports.createWeb3Trans = "/api/mpc/web3/trans/create";
exports.web3Pending = "/api/mpc/web3/pending";
exports.web3TransList = "/api/mpc/web3/trans_list";
exports.web3SyncTransList = "/api/mpc/web3/sync_trans_list";
//NFt
exports.nftInfo = "/api/nft/info";

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

