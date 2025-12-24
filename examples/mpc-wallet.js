/**
 * MPC Wallet Management Example
 * Demonstrates MPC wallet creation and operations
 */

const { MpcClient } = require('../index');

// Initialize MPC client
const mpcClient = MpcClient.newBuilder()
  .setAppId(process.env.MPC_APP_ID)
  .setRsaPrivateKey(process.env.MPC_PRIVATE_KEY)
  .setApiKey(process.env.MPC_API_KEY)
  .setDomain(process.env.MPC_DOMAIN || 'https://mpc-api.custody.chainup.com')
  .setDebug(true)
  .build();

/**
 * Example 1: Create wallet
 */
async function createWallet() {
  console.log('\n=== Create MPC Wallet ===');
  
  try {
    const walletApi = mpcClient.getWalletApi();
    
    const wallet = await walletApi.createWallet({
      requestId: `wallet_${Date.now()}`,
      walletName: `Test Wallet ${new Date().toISOString()}`
    });
    
    console.log('Wallet created:', wallet);
    return wallet;
  } catch (error) {
    console.error('Wallet creation failed:', error.message);
    throw error;
  }
}

/**
 * Example 2: Get wallet list
 */
async function getWalletList() {
  console.log('\n=== Get Wallet List ===');
  
  try {
    const walletApi = mpcClient.getWalletApi();
    
    const wallets = await walletApi.getWalletList({
      page: 1,
      pageSize: 10
    });
    
    console.log('Wallet list:', wallets);
    return wallets;
  } catch (error) {
    console.error('Get wallet list failed:', error.message);
    throw error;
  }
}

/**
 * Example 3: Create deposit address
 */
async function createDepositAddress(walletId) {
  console.log('\n=== Create Deposit Address ===');
  
  try {
    const depositApi = mpcClient.getDepositApi();
    
    const address = await depositApi.createAddress({
      requestId: `addr_${Date.now()}`,
      walletId: walletId,
      coinType: 'ETH'
    });
    
    console.log('Deposit address created:', address);
    return address;
  } catch (error) {
    console.error('Address creation failed:', error.message);
    throw error;
  }
}

/**
 * Example 4: Get deposit list
 */
async function getDepositList(walletId) {
  console.log('\n=== Get Deposit List ===');
  
  try {
    const depositApi = mpcClient.getDepositApi();
    
    const deposits = await depositApi.getDepositList({
      walletId: walletId,
      coinType: 'ETH',
      page: 1,
      pageSize: 10
    });
    
    console.log('Deposit list:', deposits);
    return deposits;
  } catch (error) {
    console.error('Get deposit list failed:', error.message);
    throw error;
  }
}

/**
 * Example 5: Submit withdrawal
 */
async function submitWithdrawal(walletId) {
  console.log('\n=== Submit MPC Withdrawal ===');
  
  try {
    const withdrawApi = mpcClient.getWithdrawApi();
    
    const result = await withdrawApi.withdraw({
      requestId: `withdraw_${Date.now()}`,
      walletId: walletId,
      coinType: 'ETH',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      amount: '0.01'
    });
    
    console.log('Withdrawal submitted:', result);
    
    // Get withdrawal info
    const info = await withdrawApi.getWithdrawInfo({
      requestId: result.requestId
    });
    
    console.log('Withdrawal info:', info);
    return result;
  } catch (error) {
    console.error('Withdrawal failed:', error.message);
    throw error;
  }
}

/**
 * Example 6: Web3 transaction
 */
async function sendWeb3Transaction(walletId) {
  console.log('\n=== Send Web3 Transaction ===');
  
  try {
    const web3Api = mpcClient.getWeb3Api();
    
    const tx = await web3Api.web3Transaction({
      requestId: `web3_${Date.now()}`,
      walletId: walletId,
      coinType: 'ETH',
      to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      value: '0.001',
      data: '0x' // Contract data if calling smart contract
    });
    
    console.log('Web3 transaction:', tx);
    return tx;
  } catch (error) {
    console.error('Web3 transaction failed:', error.message);
    throw error;
  }
}

/**
 * Example 7: Setup auto-sweep
 */
async function setupAutoSweep(walletId) {
  console.log('\n=== Setup Auto Sweep ===');
  
  try {
    const autoSweepApi = mpcClient.getAutoSweepApi();
    
    const rule = await autoSweepApi.createAutoSweep({
      requestId: `sweep_${Date.now()}`,
      walletId: walletId,
      coinType: 'ETH',
      threshold: '1.0', // Sweep when balance > 1 ETH
      targetAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
    });
    
    console.log('Auto sweep rule created:', rule);
    
    // Get auto sweep list
    const rules = await autoSweepApi.getAutoSweepList({
      walletId: walletId
    });
    
    console.log('Auto sweep rules:', rules);
    return rule;
  } catch (error) {
    console.error('Auto sweep setup failed:', error.message);
    throw error;
  }
}

/**
 * Example 8: TRON resource management
 */
async function manageTronResource(walletId) {
  console.log('\n=== Manage TRON Resource ===');
  
  try {
    const tronApi = mpcClient.getTronResourceApi();
    
    // Get current resource info
    const resource = await tronApi.getTronResource({
      walletId: walletId,
      address: 'TYour...TronAddress'
    });
    
    console.log('TRON resource:', resource);
    
    // Delegate resource
    const delegation = await tronApi.delegateTronResource({
      requestId: `tron_${Date.now()}`,
      walletId: walletId,
      resourceType: 'ENERGY', // or 'BANDWIDTH'
      amount: '100000',
      receiveAddress: 'TReceive...Address'
    });
    
    console.log('Resource delegation:', delegation);
    return resource;
  } catch (error) {
    console.error('TRON resource management failed:', error.message);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('=== ChainUp Custody MPC API Examples ===\n');
  
  try {
    // Example 1: Create wallet
    const wallet = await createWallet();
    
    // Example 2: Get wallet list
    await getWalletList();
    
    // Example 3: Create deposit address
    // await createDepositAddress(wallet.id);
    
    // Example 4: Get deposit list
    // await getDepositList(wallet.id);
    
    // Example 5: Submit withdrawal
    // await submitWithdrawal(wallet.id);
    
    // Example 6: Web3 transaction
    // await sendWeb3Transaction(wallet.id);
    
    // Example 7: Setup auto sweep
    // await setupAutoSweep(wallet.id);
    
    // Example 8: TRON resource management
    // await manageTronResource(wallet.id);
    
    console.log('\n=== All examples completed successfully! ===');
  } catch (error) {
    console.error('\n=== Example execution failed ===');
    console.error(error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  createWallet,
  getWalletList,
  createDepositAddress,
  getDepositList,
  submitWithdrawal,
  sendWeb3Transaction,
  setupAutoSweep,
  manageTronResource
};
