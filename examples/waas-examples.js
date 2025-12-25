/**
 * WaaS API Usage Examples
 * ChainUp Custody WaaS API demonstration
 */

const WaasClient = require('../custody/WaasClient');
const TransferApi = require('../custody/api/TransferApi');

// Configuration
const config = {
    appId: '',           // 应用ID
    privateKey: ``,      // RSA私钥
    publicKey: ``,       // ChainUp公钥
    host: 'https://openapi.chainup.com/',  // WaaS接口地址
    debug: false         // 是否开启调试模式
};

// Create WaaS client
const waasClient = WaasClient.newBuilder()
    .setHost(config.host)
    .setAppId(config.appId)
    .setPrivateKey(config.privateKey)
    .setPublicKey(config.publicKey)
    .setDebug(config.debug)
    .build();

// Example functions
async function runExamples() {
    try {
        // ==================== User API ====================
        
        // 1. Register user by mobile
        console.log('\n=== Registering User by Mobile ===');
        /* 
        const mobileUser = await waasClient.getUserApi().registerMobileUser({
            country: '+86',
            mobile: '13800000001'
        });
        console.log('Mobile user registered:', JSON.stringify(mobileUser, null, 2));
        */

        // 2. Register user by email
        console.log('\n=== Registering User by Email ===');
        /* 
        const emailUser = await waasClient.getUserApi().registerEmailUser({
            email: 'test@example.com'
        });
        console.log('Email user registered:', JSON.stringify(emailUser, null, 2));
        */

        // 3. Get user info by mobile
        console.log('\n=== Getting User Info by Mobile ===');
        
        const mobileUserInfo = await waasClient.getUserApi().getMobileUser({
            country: '+86',
            mobile: '13800000001'
        });
        console.log('Mobile user info:', JSON.stringify(mobileUserInfo, null, 2));
        

        // 4. Get user info by email
        console.log('\n=== Getting User Info by Email ===');
        
        const emailUserInfo = await waasClient.getUserApi().getEmailUser({
            email: 'test@example.com'
        });
        console.log('Email user info:', JSON.stringify(emailUserInfo, null, 2));
        
        // ==================== Coin API ====================

        // 5. Get supported coin list
        console.log('\n=== Getting Supported Coin List ===');
        const coinList = await waasClient.getCoinApi().getCoinList();
        console.log('Coin list (first 3):', JSON.stringify(coinList?.slice(0, 3), null, 2));

        // ==================== Account API ====================

        // 6. Get user account balance
        console.log('\n=== Getting User Account Balance ===');
        
        const userAccount = await waasClient.getAccountApi().getUserAccount({
            uid: 15036904,
            symbol: 'ALEO'
        });
        console.log('User account:', JSON.stringify(userAccount, null, 2));
        

        // 7. Get user deposit address
        console.log('\n=== Getting User Deposit Address ===');
        
        const depositAddress = await waasClient.getAccountApi().getUserAddress({
            uid: 15036904,
            symbol: 'aleo'
        });
        console.log('Deposit address:', JSON.stringify(depositAddress, null, 2));
        

        // 8. Get company account balance
        console.log('\n=== Getting Company Account Balance ===');
         
        const companyAccount = await waasClient.getAccountApi().getCompanyAccount({
            symbol: 'ETH'
        });
        console.log('Company account:', JSON.stringify(companyAccount, null, 2));
        

        // 9. Get user address info
        console.log('\n=== Getting User Address Info ===');
        
        const addressInfo = await waasClient.getAccountApi().getUserAddressInfo({
            address: '0xd4036730fd450237b8fea382bd887c4c96a8453a'
        });
        console.log('Address info:', JSON.stringify(addressInfo, null, 2));
        

        // ==================== Billing API ====================

        // 10. Create withdrawal request
        console.log('\n=== Creating Withdrawal Request ===');
     /* 
        const withdrawal = await waasClient.getBillingApi().withdraw({
            request_id: `12345678`,
            from_uid: 236759644,
            to_address: '0x0f1dc222af5ea2660ff84ae91adc48f1cb2d4991f1e6569dd24d94599c335a06',
            amount: '0.01',
            symbol: 'APTOS',
            memo: '',
            remark: 'Test withdrawal'
        });
        console.log('Withdrawal result:', JSON.stringify(withdrawal, null, 2));
        
 */
        // 11. Get withdrawal records
        console.log('\n=== Getting Withdrawal Records ===');
          
        const withdrawRecords = await waasClient.getBillingApi().withdrawList({
            ids: '12345678,withdraw_002'
        });
        console.log('Withdrawal records:', JSON.stringify(withdrawRecords, null, 2));
         
        return;
        // 12. Sync withdrawal records
        console.log('\n=== Syncing Withdrawal Records ===');
        const syncWithdrawals = await waasClient.getBillingApi().syncWithdrawList({
            max_id: 0
        });
        console.log('Synced withdrawals (first 3):', JSON.stringify(syncWithdrawals?.slice(0, 3), null, 2));

        // 13. Get deposit records
        console.log('\n=== Getting Deposit Records ===');
         
        const depositRecords = await waasClient.getBillingApi().depositList({
            ids: '3294170,456'
        });
        console.log('Deposit records:', JSON.stringify(depositRecords, null, 2));
        

        // 14. Sync deposit records
        console.log('\n=== Syncing Deposit Records ===');
        const syncDeposits = await waasClient.getBillingApi().syncDepositList({
            max_id: 0
        });
        console.log('Synced deposits (first 3):', JSON.stringify(syncDeposits?.slice(0, 3), null, 2));

        // 15. Get miner fee records
        console.log('\n=== Getting Miner Fee Records ===');
         
        const minerFees = await waasClient.getBillingApi().minerFeeList({
            ids: '123,456'
        });
        console.log('Miner fee records:', JSON.stringify(minerFees, null, 2));
        

        // 16. Sync miner fee records
        console.log('\n=== Syncing Miner Fee Records ===');
        const syncMinerFees = await waasClient.getBillingApi().syncMinerFeeList({
            max_id: 0
        });
        console.log('Synced miner fees (first 3):', JSON.stringify(syncMinerFees?.slice(0, 3), null, 2));

        // ==================== Transfer API ====================
/* 
        // 17. Internal account transfer
        console.log('\n=== Internal Account Transfer ===');
         
        const transfer = await waasClient.getTransferApi().accountTransfer({
            request_id: `transfer_${Date.now()}`,
            symbol: 'USDT',
            amount: '10',
            from: '123',
            to: '456',
            remark: 'Internal transfer'
        });
        console.log('Transfer result:', JSON.stringify(transfer, null, 2));
         */

        // 18. Get transfer records
        console.log('\n=== Getting Transfer Records ===');
         
        const transferRecords = await waasClient.getTransferApi().getAccountTransferList({
            ids: 'transfer_001,transfer_002',
            ids_type: TransferApi.REQUEST_ID
        });
        console.log('Transfer records:', JSON.stringify(transferRecords, null, 2));
        

        // 19. Sync transfer records
        console.log('\n=== Syncing Transfer Records ===');
        const syncTransfers = await waasClient.getTransferApi().syncAccountTransferList({
            max_id: 0
        });
        console.log('Synced transfers (first 3):', JSON.stringify(Array.isArray(syncTransfers) ? syncTransfers.slice(0, 3) : syncTransfers, null, 2));

        // ==================== Async Notify API ====================

        // 20. Decrypt notification (webhook callback)
        console.log('\n=== Decrypting Notification ===');
        const asyncNotifyApi = waasClient.getAsyncNotifyApi();
        
        // Example encrypted notification data (replace with actual data from webhook)
        const encryptedNotifyData = 'jhoA9MtGotqWxqEtB27SwCtJCo9JSIxh2B6m8CItrPQj2gsm6rw-ti1qY5tNP52qXg60FLK49cFj-a84m-57z8aT-Vo-YyJPTcM8Qpuyjj5Pf8tAcbBjBHganULYNPjCCkzgH5n5dlMZIp0tmpc7nV7Pp6hi63KjGGNTfAAbWp7QOVukAsQeQyBFPeKhlVEhq8xqQEN2yg_T1jHRUjIdlTDn2LG_i2tI0MlDpPg5FHL6cViSVM23WBPhJnAFOOrGhaqq06YtVG2m8_x_pLTyI5ZK61Bv0HnDUuIkDuRqNXyhko0sG9uGuKWJ3maWfUc9bSb0VcWPHeWnYUrcE2M9TVtwTEKdcImqZnvjc12YUh_Oz2a9VNls_XN_gTRbeIiTUGsiXX1Yq6OkCCxrsCgD0AXz0KOX4uphZldXq17ZO7sU21-b1y0rsk0qY6PbKRYpp4hhdeKpEfB2gckhf1rc9h17j0ufri4LqsE4EccGuQD4JcSrT5RLY4QRil4wdIO9ZPmhb-Od3zqT9OYPSvPg0QVCVpw-Tn17WfsZw2xB9gO8uzvGcvz9TfUrI8zKg6b6roTR9xt0m0oqMCyhrjAlU35QUh54MHAWI22A3WJkR4d4KhTOrq-2KuCg7Obi3SCoZmVWb28tztUwN6ttc4PJmM370g_YNCiv5Q6F95QgozYAGpu7Kc8ckcsORixNAUpqTCYaZHmST7bxCXDGPaL45H4zHe6IkU-Tf06rY7DoKeMgjGTz3Pb8hrXRXdSCYz9y0MjwGledXqnLiww0Dn_q-qWgOqQs6NeiLG5IqWKJG2e0buav2l_fH-biflRHjpidaTvFnTMUPf9k9-ygWwiWDzM9OD0X-mNdEI6WNe_27O9CtmUTxlBgRJ2tYyhF32a3flQXaA4m34PPXD_HyxFYRQXfqTt_7uaV7NinsnwN8Ll9ccFdXw8BuANu8j24zvBP0zvUyo9d1ywqn0Cw2wt-vPUWF7sZifTLkdr9O7mcAN08ByaIc1MR5ULI-lUsfi6U';
         
        const notifyData = await asyncNotifyApi.notifyRequest(encryptedNotifyData);
        if (notifyData) {
            console.log('Notification type:', notifyData.side);
            console.log('Notification data:', JSON.stringify(notifyData, null, 2));
        }
        

        // 21. Decrypt withdrawal verification request
        console.log('\n=== Decrypting Withdrawal Verification Request ===');
         
        const encryptedVerifyData = 'jhoA9MtGotqWxqEtB27SwCtJCo9JSIxh2B6m8CItrPQj2gsm6rw-ti1qY5tNP52qXg60FLK49cFj-a84m-57z8aT-Vo-YyJPTcM8Qpuyjj5Pf8tAcbBjBHganULYNPjCCkzgH5n5dlMZIp0tmpc7nV7Pp6hi63KjGGNTfAAbWp7QOVukAsQeQyBFPeKhlVEhq8xqQEN2yg_T1jHRUjIdlTDn2LG_i2tI0MlDpPg5FHL6cViSVM23WBPhJnAFOOrGhaqq06YtVG2m8_x_pLTyI5ZK61Bv0HnDUuIkDuRqNXyhko0sG9uGuKWJ3maWfUc9bSb0VcWPHeWnYUrcE2M9TVtwTEKdcImqZnvjc12YUh_Oz2a9VNls_XN_gTRbeIiTUGsiXX1Yq6OkCCxrsCgD0AXz0KOX4uphZldXq17ZO7sU21-b1y0rsk0qY6PbKRYpp4hhdeKpEfB2gckhf1rc9h17j0ufri4LqsE4EccGuQD4JcSrT5RLY4QRil4wdIO9ZPmhb-Od3zqT9OYPSvPg0QVCVpw-Tn17WfsZw2xB9gO8uzvGcvz9TfUrI8zKg6b6roTR9xt0m0oqMCyhrjAlU35QUh54MHAWI22A3WJkR4d4KhTOrq-2KuCg7Obi3SCoZmVWb28tztUwN6ttc4PJmM370g_YNCiv5Q6F95QgozYAGpu7Kc8ckcsORixNAUpqTCYaZHmST7bxCXDGPaL45H4zHe6IkU-Tf06rY7DoKeMgjGTz3Pb8hrXRXdSCYz9y0MjwGledXqnLiww0Dn_q-qWgOqQs6NeiLG5IqWKJG2e0buav2l_fH-biflRHjpidaTvFnTMUPf9k9-ygWwiWDzM9OD0X-mNdEI6WNe_27O9CtmUTxlBgRJ2tYyhF32a3flQXaA4m34PPXD_HyxFYRQXfqTt_7uaV7NinsnwN8Ll9ccFdXw8BuANu8j24zvBP0zvUyo9d1ywqn0Cw2wt-vPUWF7sZifTLkdr9O7mcAN08ByaIc1MR5ULI-lUsfi6U';
        const verifyData = asyncNotifyApi.verifyRequest(encryptedVerifyData);
        if (verifyData) {
            console.log('Verify request:', JSON.stringify(verifyData, null, 2));
        }
        

        // 22. Encrypt withdrawal verification response
        console.log('\n=== Encrypting Withdrawal Verification Response ===');
         
        const verifyResponse = asyncNotifyApi.verifyResponse(verifyData);
        if (verifyResponse) {
            console.log('Encrypted verify response:', verifyResponse);
        }
        
        console.log('\n=== All Examples Completed ===');

    } catch (error) {
        console.error('Error occurred:', error);
    }
}

// Run examples
if (require.main === module) {
    console.log('ChainUp Custody WaaS API Examples');
    console.log('==================================');
    
    runExamples();
}

module.exports = {
    runExamples
};
