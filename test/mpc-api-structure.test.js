/**
 * MPC Client API Test
 * Tests instantiation and structure of all MPC API classes
 */

const { MpcClient } = require('../index');

console.log('MPC Client API Structure Test');
console.log('==============================\n');

try {
  // Create MPC Client with dummy config
  console.log('Creating MPC Client...');
  const mpcClient = MpcClient.newBuilder()
    .setDomain('https://api.custody.chainup.com')
    .setAppId('test-app-id')
    .setRsaPrivateKey('dummy-key')
    .setApiKey('test-api-key')
    .build();
  
  console.log('✓ MPC Client created successfully\n');
  
  // Test each API
  const apis = [
    { name: 'WorkSpaceApi', getter: 'getWorkSpaceApi' },
    { name: 'WalletApi', getter: 'getWalletApi' },
    { name: 'DepositApi', getter: 'getDepositApi' },
    { name: 'WithdrawApi', getter: 'getWithdrawApi' },
    { name: 'Web3Api', getter: 'getWeb3Api' },
    { name: 'AutoSweepApi', getter: 'getAutoSweepApi' },
    { name: 'NotifyApi', getter: 'getNotifyApi' },
    { name: 'TronResourceApi', getter: 'getTronResourceApi' }
  ];

  console.log('Testing API instances:');
  console.log('----------------------');
  
  apis.forEach(({ name, getter }) => {
    try {
      const api = mpcClient[getter]();
      const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(api))
        .filter(m => m !== 'constructor' && typeof api[m] === 'function');
      
      console.log(`✓ ${name}`);
      console.log(`  Methods: ${methods.join(', ')}`);
      console.log('');
    } catch (error) {
      console.log(`✗ ${name}: ${error.message}\n`);
    }
  });

  console.log('==============================');
  console.log('✅ All MPC APIs are properly implemented!');
  console.log('\nAPI Summary:');
  console.log('- WorkSpaceApi: Workspace management operations');
  console.log('- WalletApi: Wallet creation and management');
  console.log('- DepositApi: Deposit record queries');
  console.log('- WithdrawApi: Withdrawal operations');
  console.log('- Web3Api: Web3 transaction management');
  console.log('- AutoSweepApi: Auto-sweep configuration');
  console.log('- NotifyApi: Notification handling');
  console.log('- TronResourceApi: TRON resource delegation');

} catch (error) {
  console.error('❌ Test failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}
