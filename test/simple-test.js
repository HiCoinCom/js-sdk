/**
 * Simple Test for ChainUp Custody SDK
 * Run: node test/simple-test.js
 */

console.log('ChainUp Custody SDK - Simple Test');
console.log('==================================\n');

// Test 1: Import main module
console.log('Test 1: Import main module');
try {
    const sdk = require('../index');
    console.log('✓ Main module imported successfully');
    console.log('  - MpcClientFactory:', typeof sdk.MpcClientFactory);
    console.log('  - WaaS APIs:', Object.keys(sdk.waas));
    console.log('  - MPC APIs:', Object.keys(sdk.mpc));
    console.log('  - Utils:', Object.keys(sdk.utils));
} catch (error) {
    console.log('✗ Failed to import main module:', error.message);
}

// Test 2: Import MPC Client
console.log('\nTest 2: Import MPC Client');
try {
    const { MpcClientFactory } = require('../MpcClient');
    console.log('✓ MpcClient imported successfully');
    console.log('  - MpcClientFactory:', typeof MpcClientFactory);
} catch (error) {
    console.log('✗ Failed to import MpcClient:', error.message);
}

// Test 3: Import WaaS APIs
console.log('\nTest 3: Import WaaS APIs');
try {
    const userApi = require('../apidao/userApiDao');
    const accountApi = require('../apidao/AccountApiDao');
    const billingApi = require('../apidao/BillingApiDao');
    console.log('✓ WaaS APIs imported successfully');
    console.log('  - userApi functions:', Object.keys(userApi));
    console.log('  - accountApi functions:', Object.keys(accountApi));
    console.log('  - billingApi functions:', Object.keys(billingApi));
} catch (error) {
    console.log('✗ Failed to import WaaS APIs:', error.message);
}

// Test 4: Import MPC Client
console.log('\nTest 4: Import MPC Client');
try {
    const { MpcClient } = require('../index');
    console.log('✓ MpcClient imported successfully');
    console.log('  - MpcClient type:', typeof MpcClient);
    console.log('  - Has newBuilder:', typeof MpcClient.newBuilder);
    
    // Test Builder pattern
    const builder = MpcClient.newBuilder();
    console.log('  - Builder created:', typeof builder);
    console.log('  - Builder methods:', Object.keys(builder).filter(k => typeof builder[k] === 'function'));
} catch (error) {
    console.log('✗ Failed to import MPC Client:', error.message);
}

// Test 5: Test MpcClient creation (with dummy config)
console.log('\nTest 5: Test MpcClient creation');
try {
    const { MpcClientFactory } = require('../MpcClient');
    const dummyConfig = {
        appId: 'test_app_id',
        privateKey: '-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----',
        publicKey: '-----BEGIN PUBLIC KEY-----\ntest\n-----END PUBLIC KEY-----',
        host: 'https://test.example.com',
        debug: true
    };
    
    const mpcClient = MpcClientFactory.createClient(dummyConfig);
    console.log('✓ MpcClient created successfully');
    console.log('  - Has WorkSpaceApi:', typeof mpcClient.getWorkSpaceApi === 'function');
    console.log('  - Has WalletApi:', typeof mpcClient.getWalletApi === 'function');
    console.log('  - Has WithdrawApi:', typeof mpcClient.getWithdrawApi === 'function');
    console.log('  - Has Web3Api:', typeof mpcClient.getWeb3Api === 'function');
    console.log('  - Has AutoSweepApi:', typeof mpcClient.getAutoSweepApi === 'function');
} catch (error) {
    console.log('✗ Failed to create MpcClient:', error.message);
}

// Test 6: Check Utils
console.log('\nTest 6: Check Utils');
try {
    const Constants = require('../utils/Constants');
    const MpcConstants = require('../utils/MpcConstants');
    const RSAUtil = require('../utils/RSAUtil');
    
    console.log('✓ Utils imported successfully');
    console.log('  - Constants functions:', Object.keys(Constants).filter(k => typeof Constants[k] === 'function'));
    console.log('  - MpcConstants functions:', Object.keys(MpcConstants).filter(k => typeof MpcConstants[k] === 'function'));
    console.log('  - RSAUtil functions:', Object.keys(RSAUtil));
} catch (error) {
    console.log('✗ Failed to import Utils:', error.message);
}

console.log('\n==================================');
console.log('All tests completed!');
console.log('\nNote: These are basic import tests.');
console.log('To test actual API calls, you need to:');
console.log('1. Configure your credentials');
console.log('2. Run examples/mpc-examples.js');
console.log('3. Check the official documentation\n');
