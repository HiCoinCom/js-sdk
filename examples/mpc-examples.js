/**
 * MPC API Usage Examples
 * ChainUp Custody MPC API demonstration
 */

const { MpcClientFactory } = require('../mpc/MpcClient');

// Configuration
const config = {
    appId: '',
    privateKey: ``,
    waasPublicKey: ``,
    host: 'https://openapi.chainup.com/',
    debug: false  // Enable debug mode
};

// Create MPC client
const mpcClient = MpcClientFactory.newBuilder()
    .setDomain(config.host)
    .setAppId(config.appId)
    .setRsaPrivateKey(config.privateKey)
    .setWaasPublicKey(config.waasPublicKey)
    .setSignPrivateKey(config.privateKey)
    .setDebug(config.debug)
    .build();

// Example functions
async function runExamples() {
    try {
        // 1. Workspace API - Get supported main chains
        console.log('\n=== Getting Supported Main Chains ===');
        //const chains = await mpcClient.getWorkSpaceApi().getSupportMainChain();
        //console.log('Supported chains:', JSON.stringify(chains, null, 2));

        // 2. Workspace API - Get coin details
        console.log('\n=== Getting Coin Details ===');
        const coinDetails = await mpcClient.getWorkSpaceApi().getCoinDetails({
            base_symbol: 'ETH',
            open_chain: true,
            max_id: 1,
            limit: 10
        });
        //console.log('Coin details:', JSON.stringify(coinDetails, null, 2));

        // 3. Workspace API - Get latest block height
        console.log('\n=== Getting Block Height ===');
        const blockHeight = await mpcClient.getWorkSpaceApi().getLastBlockHeight({
            base_symbol: 'ETH'
        });
        console.log('Block height:', JSON.stringify(blockHeight, null, 2));

        /* 
        // 4. Wallet API - Create wallet
        console.log('\n=== Creating Wallet ===');
        const wallet = await mpcClient.getWalletApi().createWallet({
            sub_wallet_name: 'Test Wallet',
            app_show_status: 1  // 1: show, 2: hide
        });
        console.log('Wallet created:', JSON.stringify(wallet, null, 2));
 */
        
        // 5. Wallet API - Create wallet address
        console.log('\n=== Creating Wallet Address ===');
        const address = await mpcClient.getWalletApi().createWalletAddress({
            sub_wallet_id: 1000537,  // Use the wallet ID from previous step
            symbol: 'ETH'
        });
        console.log('Address created:', JSON.stringify(address, null, 2));

        // 6. Wallet API - Query wallet addresses
        console.log('\n=== Querying Wallet Addresses ===');
        const addresses = await mpcClient.getWalletApi().queryWalletAddress({
            sub_wallet_id: 1000537,
            symbol: 'bsc',
            max_id: 0
        });
        console.log('Wallet addresses:', JSON.stringify(addresses, null, 2));

        // 7. Wallet API - Get wallet assets
        console.log('\n=== Getting Wallet Assets ===');
        const assets = await mpcClient.getWalletApi().getWalletAssets({
            sub_wallet_id: 1000537,
            symbol: 'bsc'
        });
        console.log('Wallet assets:', JSON.stringify(assets, null, 2));

        // 8. Wallet API - Verify address information
        console.log('\n=== Verifying Address Information ===');
        const addressInfo = await mpcClient.getWalletApi().walletAddressInfo({
            address: '0x633A84Ee0ab29d911e5466e5E1CB9cdBf5917E72'
        });
        console.log('Address info:', JSON.stringify(addressInfo, null, 2));
 /* 
        // 9. Withdraw API - Initiate withdrawal
        console.log('\n=== Initiating Withdrawal ===');
        const withdrawal = await mpcClient.getWithdrawApi().withdraw({
            request_id: `withdraw_${Date.now()}`,
            sub_wallet_id: 1000537,
            symbol: 'DOGE',
            address_to: 'DKjL5JXqCWF4V7DMRZt3nzr8ckg3nD4VDk',
            amount: '5',
            remark: 'Test withdrawal',
            outputs:`[{\"address_to\":\"DKjL5JXqCWF4V7DMRZt3nzr8ckg3nD4VDk\", \"amount\":\"2\"},{\"address_to\":\"DKjL5JXqCWF4V7DMRZt3nzr8ckg3nD4VDk\", \"amount\":\"3\"}]`,
            need_transaction_sign: true,
        });
        console.log('Withdrawal result:', JSON.stringify(withdrawal, null, 2));
  */
        
        // 10. Withdraw API - Get withdrawal records
        console.log('\n=== Getting Withdrawal Records ===');
        const withdrawRecords = await mpcClient.getWithdrawApi().getWithdrawRecords({
            request_ids: ['withdraw_123', 'withdraw_456']
        });
        console.log('Withdrawal records:', JSON.stringify(withdrawRecords, null, 2));

        // 11. Withdraw API - Sync withdrawal records
        console.log('\n=== Syncing Withdrawal Records ===');
        const syncWithdraw = await mpcClient.getWithdrawApi().syncWithdrawRecords({
            max_id: 0
        });
        console.log('Synced withdrawals:', JSON.stringify(syncWithdraw, null, 2));

        // 12. Deposit API - Get deposit records
        console.log('\n=== Getting Deposit Records ===');
        const depositRecords = await mpcClient.getDepositApi().getDepositRecords({
            ids: [5022457, 456, 789]
        });
        console.log('Deposit records:', JSON.stringify(depositRecords, null, 2));

        // 13. Deposit API - Sync deposit records
        console.log('\n=== Syncing Deposit Records ===');
        const syncDeposit = await mpcClient.getDepositApi().syncDepositRecords({
            max_id: 0
        });
        console.log('Synced deposits:', JSON.stringify(syncDeposit, null, 2));
/* 
        // 14. Web3 API - Create Web3 transaction
        console.log('\n=== Creating Web3 Transaction ===');
        const web3Trans = await mpcClient.getWeb3Api().createWeb3Trans({
            request_id: `web3_${Date.now()}`,
            sub_wallet_id: 123456,
            chain_id: '1',
            from_addr: '0xSenderAddress',
            to_addr: '0xReceiverAddress',
            value: '1000000000000000'
        });
        console.log('Web3 transaction:', JSON.stringify(web3Trans, null, 2));
 */
        // 15. Web3 API - Get Web3 records
        console.log('\n=== Getting Web3 Records ===');
        const web3Records = await mpcClient.getWeb3Api().getWeb3Records({
            request_ids: ['web3_123', 'web3_456']
        });
        console.log('Web3 records:', JSON.stringify(web3Records, null, 2));

        // 16. Auto Sweep API - Get auto-sweep wallets
        console.log('\n=== Getting Auto-Sweep Wallets ===');
        const sweepWallets = await mpcClient.getAutoSweepApi().autoCollectSubWallets({
            symbol: 'USDTERC20'
        });
        console.log('Auto-sweep wallets:', JSON.stringify(sweepWallets, null, 2));

        // 17. Auto Sweep API - Configure auto-sweep
        console.log('\n=== Configuring Auto-Sweep ===');
        const sweepConfig = await mpcClient.getAutoSweepApi().setAutoCollectSymbol({
            symbol: 'USDTERC20',
            collect_min: '100',
            fueling_limit: '0.01'
        });
        console.log('Auto-sweep configured:', JSON.stringify(sweepConfig, null, 2));
return
        // 18. Auto Sweep API - Sync auto-sweep records
        console.log('\n=== Syncing Auto-Sweep Records ===');
        const sweepRecords = await mpcClient.getAutoSweepApi().syncAutoCollectRecords({
            max_id: 0
        });
        console.log('Auto-sweep records:', JSON.stringify(sweepRecords, null, 2));

        
        // 20. Notify API - Decrypt notification
        console.log('\n=== Decrypting Notification ===');
        const notifyApi = mpcClient.getNotifyApi();
        const encryptedData = 'encrypted_notification_data_here';
        const decryptedNotify = notifyApi.notifyRequest(encryptedData);
        console.log('Decrypted notification:', decryptedNotify);

    } catch (error) {
        console.error('Error occurred:', error);
    }
}

// Run examples
if (require.main === module) {
    console.log('ChainUp Custody MPC API Examples');
    console.log('=================================');
    
    runExamples();
}

module.exports = {
    runExamples
};
