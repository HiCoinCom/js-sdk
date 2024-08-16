# js-sdk
waas api client sdk

Dependency package installation：

```
npm install @chainup-custody/js-waas-sdk@1.0.6
```

How to use:

```
const userApi = require('@chainup-custody/js-waas-sdk/apidao/userApiDao');
const accountApi = require('@chainup-custody/js-waas-sdk/apidao/AccountApiDao');
const billingApi = require('@chainup-custody/js-waas-sdk/apidao/BillingApiDao');
const Cons = require('@chainup-custody/js-waas-sdk/utils/Constants');
const asyncApi = require('@chainup-custody/js-waas-sdk/apidao/AsyncNotifyApiDao');


Cons.setAppId('baaceb1e506e1b5d7d1f0a3b1622583b');// app id
Cons.setHost('http://awstestopenapi.hiwallet.pro');//interface domain name
Cons.setPubKey('wass public key');
Cons.setPrivateKey('Merchant private key');
//1.Register mobile number
userApi.registerByPhone({country: '+86', mobile: '13800000000'}).then(function (data) {
    console.debug("Registered mobile number results：-----" + JSON.stringify(data));
});
//2.register e-mail
userApi.registerByEmail({email: "hicointest.@qq.com"}).then(function (data) {
    console.debug("Register Email Results：------" + JSON.stringify(data));
});
//3.Get user information
userApi.getUserInfo({ country:"86" , mobile: "138880000000"}).then(function (data) {
    console.debug("Get the result of user information address：------" + JSON.stringify(data));
});
//4.Get a list of the merchant's currency
userApi.getCoinList({time: Date.now()}).then(function (data) {
    console.debug("Get merchant's currency list results：------" + JSON.stringify(data));
});

//5.Get the address of the user-specified currency account
accountApi.getDepositAddress({symbol: "eth", uid: "3529218"}).then(function (data) {
    console.debug("Get the result of the user-specified currency account address：------" + JSON.stringify(data));
});
//6.Get the balance of the merchant collection account
accountApi.getCompanyBySymbol({symbol: "eth"}).then(function (data) {
    console.debug("Get the result of the user-specified currency account address：------" + JSON.stringify(data));
});
//7.Query the user's account according to the currency and user id
accountApi.getByUidAndSymbol({"symbol": "eth", "uid": 3529218}).then(function (data) {
    console.debug("Query the user's account result based on the currency and user id：------" + JSON.stringify(data));
});
//8.Withdraw
billingApi.withdraw({
    "request_id": 12345678,
    "from_uid": "3529218",
    "to_address": "0x754b0c610e011d0d40c810ef857b4dd989a67332",
    "amount": "1.00000022",
    "symbol": "ETH"
}).then(function (data) {
    console.debug("Withdrawal result：------" + JSON.stringify(data));
});

//9.Obtain withdrawal records in batches
billingApi.getWithdrawList({"ids": "123,345,6778"}).then(function (data) {
    console.debug("obtainWithdrawalRecordResultsInBatches：------" + JSON.stringify(data));
});
//10.Synchronize withdrawal records, return 100 recharge records greater than id
billingApi.syncWithdrawList({"max_id": 0}).then(function (data) {
    console.debug("Sync withdrawal record results：------" + JSON.stringify(data));
});
//11.Synchronize miner fee records, and return 100 recharge records greater than id
billingApi.syncMinerFeeList({"max_id": 0}).then(function (data) {
    console.debug("Sync miner fee record result：------" + JSON.stringify(data));
});

//12.Get miner fee records
billingApi.minerFeeList({"ids": "123,345,6778"}).then(function (data) {
    console.debug("Get miner fee record result：------" + JSON.stringify(data));
});
//13.Synchronized recharge record
billingApi.syncDepositList({"max_id": 0}).then(function (data) {
    console.debug("Synchronous recharge record results：------" + JSON.stringify(data));
});

//14.Get recharge records
billingApi.getDepositList({"ids": "123,345,6778"}).then(function (data) {
    console.debug("Get the recharge record result：------" + JSON.stringify(data));
});

//15. Decrypt user recharge asynchronous callback notification request parameters
var res1 = asyncApi.decodeNotifyRequest('kK506LW2SEsTeGq1t1IcqRuCykbpd-pubm5roRH7WUFDt4NHr6FGmWQ_EH2_V8TZ9m_Ri7r389ZbAPA3Z5YcLFOSWMA-URuw8mKabNu2jGA7yY91270JcIx0_b5y16LdxzqBVS1BF-
PZBBH3TTc5cv9Xx4i0r-UCvhkTmmlB4hJN1bMCnEeDXHcloLeBpyFvO_-hMBWXymSUp55VVW1m7ua6eImIAoWY1UrTGFoV_xG4ACWbBGBBAVybrFFRXkFTHwat5J7vn4dcPH-Ih4bCoAQofXRhjka8eFR8EfD4TeRN1ZR1x7w8wpJnGdQuazpU6uwKlcVP0RcJCqzIROWqnw');
console.debug("Decrypt user recharge asynchronous callback notification request parameters---" + res1);
//16. Decryption and withdrawal secondary verification request parameters
var res2 = asyncApi.decodeWithdrawRequest('Encrypted request parameters');
console.debug("Decryption and withdrawal secondary verification request parameters---" + res2);
//17. Encrypted secondary verification withdrawal response data
var res3 = asyncApi.encodeWithdrawResponse({"check_sum":"1234","time":"12345678"});
console.debug("Encrypted secondary verification withdrawal response data---" + res3);

//18.WaaS Merchant Transfer
transferApi.transfer({request_id: "1233456778",symbol:"usdt",to:"10c533a212a795f692db6684d70c95e9",remark:"transfer123",amount:"1.0000002"}).then(function (data) {
    console.debug("WaaS Merchant Transfer Results：------" + JSON.stringify(data));
});

//19.Batch query transfer records
transferApi.getTransferList({ids: "123",ids_type:"request_id"}).then(function (data) {
    console.debug("Batch query transfer record results：------" + JSON.stringify(data));
});

//20.Synchronize all transfer records (pagination)
transferApi.getTransferList({max_id:0}).then(function (data) {
    console.debug("Synchronize all transfer records (paginated) results：------" + JSON.stringify(data));
});


//MPC SDK
const Cons = require('@chainup-custody/mpc-js-waas-sdk/utils/MpcConstants');
const autoSweepApi = require('@chainup-custody/mpc-js-waas-sdk/mpc/AutoSweepApiDao');
const depositApi = require('@chainup-custody/mpc-js-waas-sdk/mpc/DepositApiDao');
const nftApi = require('@chainup-custody/mpc-js-waas-sdk/mpc/NftApiDao');
const walletApi = require('@chainup-custody/mpc-js-waas-sdk/mpc/WalletApiDao');
const web3TransApi = require('@chainup-custody/mpc-js-waas-sdk/mpc/Web3TransactionApiDao');
const withdrawApi = require('@chainup-custody/mpc-js-waas-sdk/mpc/WithdrawApiDao');
const workspaceApi = require('@chainup-custody/mpc-js-waas-sdk/mpc/WorkSpaceApiDao');
const asyncApi = require('@chainup-custody/mpc-js-waas-sdk/mpc/AsyncNotifyApiDao');


Cons.setAppId('baaceb1e506e1b5d7d1f0a3b1622583b');// app id
Cons.setHost('http://awstestopenapi.hiwallet.pro');//interface domain name
Cons.setPubKey('wass public key');
Cons.setPrivateKey('Merchant private key');


//1.Workspace
workspaceApi.openCoin().then(function (data) {
    console.debug("get openCoin results：-----" + JSON.stringify(data));
});
workspaceApi.coinList({symbol: 'USDTERC20'}).then(function (data) {
    console.debug("get coinList results：-----" + JSON.stringify(data));
});
workspaceApi.chainHeight({base_symbol: 'ETH'}).then(function (data) {
    console.debug("get chainHeight results：-----" + JSON.stringify(data));
});

//2. Wallet
walletApi.createSubWallet({sub_wallet_name: 'test1', app_show_status: '2'}).then(function (data) {
    console.debug("createSubWallet results：-----" + JSON.stringify(data));
});
walletApi.createAddress({sub_wallet_id: '100002', symbol: 'USDTERC20'}).then(function (data) {
    console.debug("createAddress results：-----" + JSON.stringify(data));
});
walletApi.addressList({
         sub_wallet_id: '100002',
         symbol: 'USDTERC20',
         max_id: '0'
       }).then(function (data) {
    console.debug("get addressList results：-----" + JSON.stringify(data));
});
walletApi.subWalletAssets({sub_wallet_id: '100002', symbol: 'USDTERC20'}).then(function (data) {
    console.debug("get subWalletAssets results：-----" + JSON.stringify(data));
});
walletApi.changeShowStatus({sub_wallet_ids: '100002,100003', app_show_status: '1'}).then(function (data) {
    console.debug("changeShowStatus results：-----" + JSON.stringify(data));
});
walletApi.addressInfo({address: '12ZzzA48sYnE12fdkmKmaxkR3Rz5j7Gjac', memo: '312317368'}).then(function (data) {
    console.debug("get addressInfo results：-----" + JSON.stringify(data));
});

//3.withdraw
withdrawApi.withdraw({
    "sub_wallet_id": 1000001,
    "from": "12ZzzA48sYnE12fdkmKmaxkR3Rz5j7Gjac",
    "address_to": "0x754b0c610e011d0d40c810ef857b4dd989a67332",
    "request_id": 12345678,
    "amount": "1.00000022",
    "symbol": "ETH"
}).then(function (data) {
    console.debug("withdraw results：-----" + JSON.stringify(data));
});
withdrawApi.withdrawList({ids: '12313123,12312387'}).then(function (data) {
    console.debug("get withdrawList results：-----" + JSON.stringify(data));
});
withdrawApi.syncWithdrawList({max_id: '100'}).then(function (data) {
    console.debug("syncWithdrawList results：-----" + JSON.stringify(data));
});



//4.Deposit
depositApi.depositList({ids: '123122,234234'}).then(function (data) {
    console.debug("get depositList results：-----" + JSON.stringify(data));
});
depositApi.syncDepositList({max_id: '100'}).then(function (data) {
    console.debug("syncDepositList results：-----" + JSON.stringify(data));
});



//5.AutoSweep
autoSweepApi.getAutoCollectSubWallets({symbol: 'USDTERC20'}).then(function (data) {
    console.debug("getAutoCollectSubWallets results：-----" + JSON.stringify(data));
});
autoSweepApi.setAutoCollectSymbols({
    "collect_min": 0.0001,
    "fueling_limit": "0.0001",
    "symbol": "ETH"
}).then(function (data) {
    console.debug("setAutoCollectSymbols results：-----" + JSON.stringify(data));
});
autoSweepApi.syncAutoCollectList({max_id: '100'}).then(function (data) {
    console.debug("syncAutoCollectList results：-----" + JSON.stringify(data));
});


//6.web3Transaction
web3TransApi.createWeb3Trans({
    "sub_wallet_id": 1000001,
    "request_id": "1234567",
    "main_chain_symbol": "ETH",
    "interactive_contract": 12345678,
    "amount": "1",
    "gas_price": "25",
    "gas_limit": "102300000",
    "input_data": "123131231w1yg1yg3uy12321",
    "trans_type": "1"
}).then(function (data) {
    console.debug("createWeb3Trans results：-----" + JSON.stringify(data));
});
web3TransApi.web3Pending({trans_id: '12345'}).then(function (data) {
    console.debug("web3Pending results：-----" + JSON.stringify(data));
});
web3TransApi.web3TransList({ids: '123,124,125'}).then(function (data) {
    console.debug("get web3TransList results：-----" + JSON.stringify(data));
});
web3TransApi.web3SyncTransList({max_id: '100'}).then(function (data) {
    console.debug("get web3SyncTransList results：-----" + JSON.stringify(data));
});

//7.Nft
workspaceApi.nftInfo({base_symbol: 'ETH',contract_address: '0xC2A19349D5f451071C3085B90f531D19F190FF21'}).then(function (data) {
    console.debug("get nftInfo results：-----" + JSON.stringify(data));
});

//8 Notify
var res1 = asyncApi.decodeNotifyRequest('kK506LW2SEsTeGq1t1IcqRuCykbpd-pubm5roRH7WUFDt4NHr6FGmWQ_EH2_V8TZ9m_Ri7r389ZbAPA3Z5YcLFOSWMA-URuw8mKabNu2jGA7yY91270JcIx0_b5y16LdxzqBVS1BF-
PZBBH3TTc5cv9Xx4i0r-UCvhkTmmlB4hJN1bMCnEeDXHcloLeBpyFvO_-hMBWXymSUp55VVW1m7ua6eImIAoWY1UrTGFoV_xG4ACWbBGBBAVybrFFRXkFTHwat5J7vn4dcPH-Ih4bCoAQofXRhjka8eFR8EfD4TeRN1ZR1x7w8wpJnGdQuazpU6uwKlcVP0RcJCqzIROWqnw');
console.debug("Decrypt deposit callback notification request parameters---" + res1);

```
