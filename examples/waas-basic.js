/**
 * WaaS Basic Operations Example
 * Demonstrates basic usage of WaaS Custody API
 */

const { WaasClient } = require('../index');

// Initialize WaaS client
const client = WaasClient.newBuilder()
  .setHost(process.env.WAAS_HOST || 'https://api.custody.chainup.com')
  .setAppId(process.env.WAAS_APP_ID)
  .setPrivateKey(process.env.WAAS_PRIVATE_KEY)
  .setPublicKey(process.env.WAAS_PUBLIC_KEY)
  .setDebug(true)
  .build();

/**
 * Example 1: Register a new user
 */
async function registerUser() {
  console.log('\n=== Register User ===');
  
  try {
    const userApi = client.getUserApi();
    
    // Register by email
    const user = await userApi.registerByEmail({
      email: `test${Date.now()}@example.com`
    });
    
    console.log('User registered:', user);
    return user;
  } catch (error) {
    console.error('Registration failed:', error.message);
    throw error;
  }
}

/**
 * Example 2: Create account and get deposit address
 */
async function createAccountAndGetAddress(userId) {
  console.log('\n=== Create Account and Get Deposit Address ===');
  
  try {
    const accountApi = client.getAccountApi();
    
    // Create BTC account
    const account = await accountApi.createAccount({
      userId: userId,
      coinType: 'BTC'
    });
    
    console.log('Account created:', account);
    
    // Get deposit address
    const address = await accountApi.getDepositAddress({
      userId: userId,
      coinType: 'BTC'
    });
    
    console.log('Deposit address:', address);
    return address;
  } catch (error) {
    console.error('Account creation failed:', error.message);
    throw error;
  }
}

/**
 * Example 3: Check balance
 */
async function checkBalance(userId) {
  console.log('\n=== Check Balance ===');
  
  try {
    const accountApi = client.getAccountApi();
    
    const balance = await accountApi.getBalance({
      userId: userId,
      coinType: 'BTC'
    });
    
    console.log('Balance:', balance);
    return balance;
  } catch (error) {
    console.error('Balance check failed:', error.message);
    throw error;
  }
}

/**
 * Example 4: Internal transfer
 */
async function internalTransfer(fromUserId, toUserId) {
  console.log('\n=== Internal Transfer ===');
  
  try {
    const transferApi = client.getTransferApi();
    
    const result = await transferApi.transfer({
      fromUserId: fromUserId,
      toUserId: toUserId,
      coinType: 'USDT',
      amount: '10.5',
      requestId: `transfer_${Date.now()}`
    });
    
    console.log('Transfer result:', result);
    return result;
  } catch (error) {
    console.error('Transfer failed:', error.message);
    throw error;
  }
}

/**
 * Example 5: Query deposit records
 */
async function queryDeposits() {
  console.log('\n=== Query Deposit Records ===');
  
  try {
    const billingApi = client.getBillingApi();
    
    const deposits = await billingApi.getDepositRecords({
      coinType: 'BTC',
      limit: 10
    });
    
    console.log('Recent deposits:', deposits);
    return deposits;
  } catch (error) {
    console.error('Query deposits failed:', error.message);
    throw error;
  }
}

/**
 * Example 6: Submit withdrawal
 */
async function submitWithdrawal(userId) {
  console.log('\n=== Submit Withdrawal ===');
  
  try {
    const transferApi = client.getTransferApi();
    
    const result = await transferApi.withdraw({
      userId: userId,
      coinType: 'ETH',
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      amount: '0.1',
      requestId: `withdraw_${Date.now()}`
    });
    
    console.log('Withdrawal submitted:', result);
    
    // Check withdrawal status
    const status = await transferApi.getWithdrawStatus({
      id: result.id
    });
    
    console.log('Withdrawal status:', status);
    return result;
  } catch (error) {
    console.error('Withdrawal failed:', error.message);
    throw error;
  }
}

/**
 * Example 7: Get coin list
 */
async function getCoinList() {
  console.log('\n=== Get Coin List ===');
  
  try {
    const coinApi = client.getCoinApi();
    
    const coinList = await coinApi.getCoinList();
    console.log('Supported coins:', coinList);
    
    // Get specific coin config
    if (coinList && coinList.length > 0) {
      const config = await coinApi.getCoinConfig({
        coinType: 'BTC'
      });
      console.log('BTC config:', config);
    }
    
    return coinList;
  } catch (error) {
    console.error('Get coin list failed:', error.message);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('=== ChainUp Custody WaaS API Examples ===\n');
  
  try {
    // Example 1: Register user
    // const user = await registerUser();
    
    // Example 2: Create account and get address
    // await createAccountAndGetAddress(user.id);
    
    // Example 3: Check balance
    // await checkBalance(user.id);
    
    // Example 4: Internal transfer (requires 2 users)
    // await internalTransfer('userId1', 'userId2');
    
    // Example 5: Query deposits
    // await queryDeposits();
    
    // Example 6: Submit withdrawal
    // await submitWithdrawal(user.id);
    
    // Example 7: Get coin list
    await getCoinList();
    
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
  registerUser,
  createAccountAndGetAddress,
  checkBalance,
  internalTransfer,
  queryDeposits,
  submitWithdrawal,
  getCoinList
};
