/**
 * MPC Withdrawal with Signature - Example
 * Demonstrates how to use MPC withdrawal with transaction signature
 */

const { MpcClient } = require('../index');

// Configuration
const config = {
  domain: 'https://mpc-api.custody.chainup.com',
  appId: 'your-app-id',
  rsaPrivateKey: `-----BEGIN PRIVATE KEY-----
your-rsa-private-key-for-api-communication
-----END PRIVATE KEY-----`,
  apiKey: 'your-api-key',
  // Optional: Signing private key for withdrawal/web3 transaction signatures
  signPrivateKey: `-----BEGIN PRIVATE KEY-----
your-signing-private-key-for-transaction-signing
-----END PRIVATE KEY-----`,
  debug: true
};

async function main() {
  // Create MPC client
  const mpcClient = MpcClient.newBuilder()
    .setDomain(config.domain)
    .setAppId(config.appId)
    .setRsaPrivateKey(config.rsaPrivateKey)
    .setApiKey(config.apiKey)
    .setSignPrivateKey(config.signPrivateKey) // Optional: for transaction signing
    .setDebug(config.debug)
    .build();

  const withdrawApi = mpcClient.getWithdrawApi();

  console.log('='.repeat(60));
  console.log('MPC Withdrawal Examples');
  console.log('='.repeat(60));

  // Example 1: Withdrawal without signature (default)
  console.log('\n1. Withdrawal WITHOUT signature:');
  console.log('-'.repeat(60));
  try {
    const result1 = await withdrawApi.withdraw({
      requestId: `test-${Date.now()}-1`,
      subWalletId: 123456,
      symbol: 'ETH',
      amount: '0.001',
      addressTo: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
    });
    console.log('✓ Withdrawal submitted successfully:');
    console.log(JSON.stringify(result1, null, 2));
  } catch (error) {
    console.error('✗ Withdrawal failed:', error.message);
  }

  // Example 2: Withdrawal with signature
  console.log('\n2. Withdrawal WITH signature:');
  console.log('-'.repeat(60));
  try {
    const result2 = await withdrawApi.withdraw({
      requestId: `test-${Date.now()}-2`,
      subWalletId: 123456,
      symbol: 'ETH',
      amount: '0.002',
      addressTo: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      needTransactionSign: true // Enable signature
    });
    console.log('✓ Withdrawal with signature submitted successfully:');
    console.log(JSON.stringify(result2, null, 2));
  } catch (error) {
    console.error('✗ Withdrawal with signature failed:', error.message);
  }

  // Example 3: Withdrawal with memo (for coins like XRP, EOS)
  console.log('\n3. Withdrawal with memo:');
  console.log('-'.repeat(60));
  try {
    const result3 = await withdrawApi.withdraw({
      requestId: `test-${Date.now()}-3`,
      subWalletId: 123456,
      symbol: 'XRP',
      amount: '10',
      addressTo: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
      memo: '123456',
      needTransactionSign: true
    });
    console.log('✓ Withdrawal with memo submitted successfully:');
    console.log(JSON.stringify(result3, null, 2));
  } catch (error) {
    console.error('✗ Withdrawal with memo failed:', error.message);
  }

  // Example 4: UTXO withdrawal (for BTC-like coins)
  console.log('\n4. UTXO withdrawal (BTC):');
  console.log('-'.repeat(60));
  try {
    const result4 = await withdrawApi.withdraw({
      requestId: `test-${Date.now()}-4`,
      subWalletId: 123456,
      symbol: 'BTC',
      amount: '0.0001',
      addressTo: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      outputs: JSON.stringify([
        {
          address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
          amount: '0.0001'
        }
      ]),
      needTransactionSign: true
    });
    console.log('✓ UTXO withdrawal submitted successfully:');
    console.log(JSON.stringify(result4, null, 2));
  } catch (error) {
    console.error('✗ UTXO withdrawal failed:', error.message);
  }

  // Example 5: Query withdrawal records
  console.log('\n5. Query withdrawal records:');
  console.log('-'.repeat(60));
  try {
    const records = await withdrawApi.getWithdrawRecords({
      requestIds: ['test-request-id-1', 'test-request-id-2']
    });
    console.log('✓ Withdrawal records retrieved:');
    console.log(JSON.stringify(records, null, 2));
  } catch (error) {
    console.error('✗ Query failed:', error.message);
  }

  // Example 6: Sync withdrawal records
  console.log('\n6. Sync withdrawal records:');
  console.log('-'.repeat(60));
  try {
    const syncRecords = await withdrawApi.syncWithdrawRecords({
      maxId: 0
    });
    console.log('✓ Withdrawal records synced:');
    console.log(JSON.stringify(syncRecords, null, 2));
  } catch (error) {
    console.error('✗ Sync failed:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('Examples completed!');
  console.log('='.repeat(60));
}

// Signature Verification Example
function demonstrateSignatureGeneration() {
  const MpcSignUtil = require('../utils/MpcSignUtil');

  console.log('\n' + '='.repeat(60));
  console.log('Signature Generation Demonstration');
  console.log('='.repeat(60));

  // Withdrawal parameters
  const withdrawParams = {
    request_id: 'test-123',
    sub_wallet_id: '1001',
    symbol: 'HECO',
    address_to: '0xcF88c8a960d5e155A9F3236a9f4e7CacE29E5050',
    amount: '0.00000100000', // Will be normalized to 0.000001
    memo: ''
  };

  console.log('\n1. Original parameters:');
  console.log(JSON.stringify(withdrawParams, null, 2));

  // Sort and format parameters
  const sortedParams = MpcSignUtil.paramsSort(withdrawParams);
  console.log('\n2. Sorted parameters (for signing):');
  console.log(sortedParams);

  // Generate MD5
  const md5Hash = MpcSignUtil.md5(sortedParams);
  console.log('\n3. MD5 hash:');
  console.log(md5Hash);

  console.log('\n4. Signature process:');
  console.log('   a) Parameters sorted in ASCII order');
  console.log('   b) Empty values removed');
  console.log('   c) Amount trailing zeros removed (0.00000100000 → 0.000001)');
  console.log('   d) Converted to lowercase');
  console.log('   e) MD5 hash generated');
  console.log('   f) RSA-SHA256 signature applied');
  console.log('   g) Base64 encoded');

  // Example with different amount formats
  console.log('\n5. Amount normalization examples:');
  const amounts = [
    '1.0001000',
    '8.00088800',
    '0.00000100000',
    '100.000',
    '1.10'
  ];

  amounts.forEach(amount => {
    const params = { amount };
    const sorted = MpcSignUtil.paramsSort(params);
    console.log(`   ${amount} → ${sorted}`);
  });

  console.log('\n' + '='.repeat(60));
}

// Run examples
if (require.main === module) {
  main().catch(console.error);
  
  // Uncomment to see signature generation details
  // demonstrateSignatureGeneration();
}

module.exports = { main, demonstrateSignatureGeneration };
