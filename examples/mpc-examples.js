/**
 * MPC API Usage Examples
 * ChainUp Custody MPC API demonstration
 */

const { MpcClientFactory } = require('../mpc/MpcClient');
const { sign } = require('../utils/MpcSignUtil');

// Configuration
const config = {
    appId: '',
    privateKey: ``,
    waasPublicKey: ``,
    signPrivateKey: ``,
    host: 'https://openapi.chainup.com/',
    debug: false  // Enable debug mode
};

// Create MPC client
const mpcClient = MpcClientFactory.newBuilder()
    .setDomain(config.host)
    .setAppId(config.appId)
    .setRsaPrivateKey(config.privateKey)
    .setWaasPublicKey(config.waasPublicKey)
    .setSignPrivateKey(config.signPrivateKey) // Optional: for withdrawal/web3 signing
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
  
        // 9. Withdraw API - Initiate withdrawal
        console.log('\n=== Initiating Withdrawal ===');
        const withdrawal = await mpcClient.getWithdrawApi().withdraw({
            request_id: `123456789023`,
            sub_wallet_id: 1000537,
            symbol: 'Sepolia',
            address_to: '0xdcb0D867403adE76e75a4A6bBcE9D53C9d05B981',
            amount: '0.001',
            remark: 'Test withdrawal',
            outputs:``,
            need_transaction_sign: true,
        });
        console.log('Withdrawal result:', JSON.stringify(withdrawal, null, 2));
  
        
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
        //console.log('Synced withdrawals:', JSON.stringify(syncWithdraw, null, 2));

        // 12. Deposit API - Get deposit records
        console.log('\n=== Getting Deposit Records ===');
        const depositRecords = await mpcClient.getDepositApi().getDepositRecords({
            ids: [5022457, 456, 789]
        });
        //console.log('Deposit records:', JSON.stringify(depositRecords, null, 2));

        // 13. Deposit API - Sync deposit records
        console.log('\n=== Syncing Deposit Records ===');
        const syncDeposit = await mpcClient.getDepositApi().syncDepositRecords({
            max_id: 0
        });
        //console.log('Synced deposits:', JSON.stringify(syncDeposit, null, 2));
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

        // 18. Auto Sweep API - Sync auto-sweep records
        console.log('\n=== Syncing Auto-Sweep Records ===');
        const sweepRecords = await mpcClient.getAutoSweepApi().syncAutoCollectRecords({
            max_id: 0
        });
        //console.log('Auto-sweep records:', JSON.stringify(sweepRecords, null, 2));

        
        // 20. Notify API - Decrypt notification
        console.log('\n=== Decrypting Notification ===');
        const notifyApi = mpcClient.getNotifyApi();
        const encryptedData = 'Af-uUJj8a2-Og7E5CwzANv4vo8NMf-z-DijwrIuK74Or8eRveM7G_-f0ErtX4WurcVrjdWC-tqU0BDhBwiDijbdyCFBvYB5UmLnHL_Rg13amhQTM-kaHoh-U9WPhYB3vGRwWkTwJ_aETERVVciAvoTf5CalqydMSe8G3KNz-ymrSVUe92DfW5ZdDKJm1hNYYteGJvg0hk--GRiPybPv2W78NlTLyWmXq094megsVzZv-KlsEGPUvPoBnEJ0Xu__AO-l-GfCG4rVO4rb8J01Nq_0Q9eRKcKWq0ci7MfnPPLMhtAWwRvSd3U8PUNHOLqGaJzOLraFnuFUHn90h7T23_DeAduA2W6dto99qb8YQ_iVnMnOKfE0Ls7Vv5S2qhgQJ0nl-BA3PPPOwW37cMb-wTbi3ZezU_S1NQEbrruEChkPhTaK0AqsM6mESV8wGflcWx3N9XPv6QatJ9zedBnkfJ4bJ4Vy2rUEtQF8eVc6zXhV8PuDRiSMf0V0yxzMjE6o9z0s087KSAqFphitlHvQMPJ29FUnyvCe_Czr5WPuhl89GOZjERE2uoNTfHqAlZVzMamoPv4y0qyIjJTufAQm-WwrQK9kGesky7eCiOXVdtR9UhEYpzEJSgXxENjUrHMx6D2AlEzlr17a2DgI-WrWB7oUnyiNnf__ElmLPPkJBdFUfzJByQkLxkUB0FLvTWdVbiIRPmPpdgb7jkhJsHUSOH0NmULqu8bYiEQtGfqRJh8I98qDzHWwfE_VAbqwATj2oD959Fm1eInBqh7eXGoy2WR3o00VpPrNvoE4eJNmw3WpVzlRF7ZVwOpcWRT-dHTShz9mB2Etk9P8D4rGmMZyXHkt4aGUJkE1b3cOEjzkOEFX8CaNe-VHiBYhIyFzMetn7mfIFB0hl565FGEumbhDKNNz_m9T2qPM5k4BQ9fLWUt_WJAVdC81_piIlBOQfYPDbdYoc_9ser1p-Jy5cgTyOMdWuSWC3jMsT09xr8dMcLkKmd39khGidAvGqOOPL1ST0';
        const decryptedNotify = await notifyApi.notifyRequest(encryptedData);
        console.log('Decrypted notification:', decryptedNotify);

        // tron delegate
        console.log('\n=== TRON Delegate ===');
        tronApi = mpcClient.getTronResourceApi()
        const tronRecord = await tronApi.createTronDelegate({
            request_id: `12345678901`,
            resource_type: 1,
            buy_type: 0,
            energy_num: 32000,
            address_from: 'TPjJg9FnzQuYBd6bshgaq7rkH4s36zju5S',
            address_to: 'TGmBzYfBBtMfFF8v9PweTaPwn3WoB7aGPd',
            contract_address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
            service_charge_type: '10010'
        }); 
         console.log('tronRecord :', tronRecord);

         console.log('\n=== Get TRON Delegate Records ===');
         const tronRecords = await tronApi.getBuyResourceRecords(['1234567890']);
         console.log('Tron delegate records:', JSON.stringify(tronRecords, null, 2));   

         console.log(await tronApi.syncBuyResourceRecords(0));

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
