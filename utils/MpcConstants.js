/**
 * MPC API Constants
 * ChainUp Custody MPC API Configuration
 */

exports.DEBUG = false;
exports.UTF8 = 'utf8';

// HTTP Configuration
exports.HOST = "";
exports.VER = '';  // MPC API 不需要 /api/v2 前缀
exports.GET = 'GET';
exports.POST = 'POST';
exports.app_id = '';

// MPC Workspace API
exports.SUPPORT_MAIN_CHAIN = "/api/mpc/wallet/open_coin";
exports.COIN_DETAILS = "/api/mpc/coin_list";
exports.LAST_BLOCK_HEIGHT = "/api/mpc/chain_height";

// MPC Wallet API
exports.CREATE_WALLET = "/api/mpc/sub_wallet/create";
exports.CREATE_WALLET_ADDRESS = "/api/mpc/sub_wallet/create_address";
exports.QUERY_WALLET_ADDRESS = "/api/mpc/sub_wallet/address_list";
exports.GET_WALLET_ASSETS = "/api/mpc/sub_wallet/assets";
exports.CHANGE_SHOW_STATUS = "/api/mpc/sub_wallet/change_show_status";
exports.ADDRESS_INFO = "/api/mpc/sub_wallet/address/info";

// MPC Billing (Withdraw/Deposit) API
exports.MPC_WITHDRAW = "/api/mpc/billing/withdraw";
exports.MPC_WITHDRAW_RECORDS = "/api/mpc/billing/withdraw_list";
exports.MPC_SYNC_WITHDRAW_RECORDS = "/api/mpc/billing/sync_withdraw_list";
exports.MPC_DEPOSIT_RECORDS = "/api/mpc/billing/deposit_list";
exports.MPC_SYNC_DEPOSIT_RECORDS = "/api/mpc/billing/sync_deposit_list";

// MPC Web3 API
exports.CREATE_WEB3_TRANSACTION = "/api/mpc/web3/trans/create";
exports.ACCELERATION_WEB3_TRANSACTION = "/api/mpc/web3/pending";
exports.WEB3_RECORDS = "/api/mpc/web3/trans_list";
exports.SYNC_WEB3_RECORDS = "/api/mpc/web3/sync_trans_list";

// MPC Auto Sweep API
exports.AUTO_COLLECT_WALLETS = "/api/mpc/auto_collect/sub_wallets";
exports.SET_AUTO_COLLECT_SYMBOL = "/api/mpc/billing/auto_collect/symbol/set";
exports.SYNC_AUTO_SWEEP_RECORDS = "/api/mpc/billing/sync_auto_collect_list";

// MPC Tron Resource API
exports.TRON_CREATE_DELEGATE = "/api/mpc/tron/delegate";
exports.TRON_DELEGATE_RECORDS = "/api/mpc/tron/delegate_list";

// Key Configuration
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
    if (pKey.startsWith('-----BEGIN PUBLIC KEY-----') && pKey.endsWith('-----END PUBLIC KEY-----')) {
        this.hiCoinPubKey = pKey;
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
