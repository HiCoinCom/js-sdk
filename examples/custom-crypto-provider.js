/**
 * Custom Crypto Provider Example
 * 
 * This example demonstrates how to implement a custom encryption provider
 * for use with ChainUp Custody SDK. This is useful when you want to:
 * - Use Hardware Security Modules (HSM)
 * - Integrate with cloud KMS services (AWS KMS, Azure Key Vault, etc.)
 * - Implement custom encryption algorithms
 * - Use your own key management system
 */

const { WaasClient, ICryptoProvider } = require('../index');

/**
 * Example 1: Simple Custom Crypto Provider
 * 
 * This example shows a basic implementation that might delegate
 * to an external encryption service.
 */
class SimpleCryptoProvider extends ICryptoProvider {
  constructor(encryptionService) {
    super();
    this.encryptionService = encryptionService;
  }

  /**
   * Encrypt data using your custom implementation
   * @param {string} data - Data to encrypt
   * @returns {string} Encrypted data (base64 encoded)
   */
  encryptWithPrivateKey(data) {
    // Delegate to your encryption service
    const encrypted = this.encryptionService.encrypt(data);
    return Buffer.from(encrypted).toString('base64');
  }

  /**
   * Decrypt data using your custom implementation
   * @param {string} encryptedData - Encrypted data (base64 encoded)
   * @returns {string} Decrypted data
   */
  decryptWithPublicKey(encryptedData) {
    const buffer = Buffer.from(encryptedData, 'base64');
    return this.encryptionService.decrypt(buffer);
  }

  /**
   * Sign data (alias for encryptWithPrivateKey)
   * @param {string} data - Data to sign
   * @returns {string} Signature
   */
  sign(data) {
    return this.encryptWithPrivateKey(data);
  }

  /**
   * Verify signature (alias for decryptWithPublicKey)
   * @param {string} data - Original data
   * @param {string} signature - Signature to verify
   * @returns {string} Decrypted signature for comparison
   */
  verify(data, signature) {
    return this.decryptWithPublicKey(signature);
  }
}

/**
 * Example 2: AWS KMS Crypto Provider
 * 
 * This example shows how to integrate with AWS KMS.
 * Requires: npm install @aws-sdk/client-kms
 */
class AwsKmsCryptoProvider extends ICryptoProvider {
  constructor(kmsClient, keyId) {
    super();
    this.kmsClient = kmsClient;
    this.keyId = keyId;
  }

  async encryptWithPrivateKey(data) {
    const { KMSClient, SignCommand } = require('@aws-sdk/client-kms');
    
    const command = new SignCommand({
      KeyId: this.keyId,
      Message: Buffer.from(data),
      SigningAlgorithm: 'RSASSA_PKCS1_V1_5_SHA_256'
    });

    const response = await this.kmsClient.send(command);
    return Buffer.from(response.Signature).toString('base64');
  }

  async decryptWithPublicKey(encryptedData) {
    const { VerifyCommand } = require('@aws-sdk/client-kms');
    
    // In practice, you would verify against expected data
    // This is a simplified example
    const buffer = Buffer.from(encryptedData, 'base64');
    return buffer.toString('utf8');
  }

  sign(data) {
    return this.encryptWithPrivateKey(data);
  }

  verify(data, signature) {
    return this.decryptWithPublicKey(signature);
  }
}

/**
 * Example 3: HSM Crypto Provider
 * 
 * This example shows how to integrate with a Hardware Security Module.
 */
class HsmCryptoProvider extends ICryptoProvider {
  constructor(hsmClient, keyLabel) {
    super();
    this.hsmClient = hsmClient;
    this.keyLabel = keyLabel;
  }

  encryptWithPrivateKey(data) {
    // Use HSM to sign data with private key
    const signature = this.hsmClient.sign({
      keyLabel: this.keyLabel,
      data: Buffer.from(data),
      mechanism: 'RSA_PKCS'
    });
    
    return signature.toString('base64');
  }

  decryptWithPublicKey(encryptedData) {
    // Use HSM to verify/decrypt with public key
    const buffer = Buffer.from(encryptedData, 'base64');
    const decrypted = this.hsmClient.decrypt({
      keyLabel: this.keyLabel,
      data: buffer,
      mechanism: 'RSA_PKCS'
    });
    
    return decrypted.toString('utf8');
  }

  sign(data) {
    return this.encryptWithPrivateKey(data);
  }

  verify(data, signature) {
    return this.decryptWithPublicKey(signature);
  }
}

/**
 * Example 4: Azure Key Vault Crypto Provider
 * 
 * This example shows how to integrate with Azure Key Vault.
 * Requires: npm install @azure/keyvault-keys @azure/identity
 */
class AzureKeyVaultCryptoProvider extends ICryptoProvider {
  constructor(keyClient, keyName) {
    super();
    this.keyClient = keyClient;
    this.keyName = keyName;
  }

  async encryptWithPrivateKey(data) {
    const { CryptographyClient } = require('@azure/keyvault-keys');
    
    const key = await this.keyClient.getKey(this.keyName);
    const cryptoClient = new CryptographyClient(key, this.keyClient.vaultUrl);
    
    const signResult = await cryptoClient.sign('RS256', Buffer.from(data));
    return Buffer.from(signResult.result).toString('base64');
  }

  async decryptWithPublicKey(encryptedData) {
    const { CryptographyClient } = require('@azure/keyvault-keys');
    
    const key = await this.keyClient.getKey(this.keyName);
    const cryptoClient = new CryptographyClient(key, this.keyClient.vaultUrl);
    
    // Verification logic here
    const buffer = Buffer.from(encryptedData, 'base64');
    return buffer.toString('utf8');
  }

  sign(data) {
    return this.encryptWithPrivateKey(data);
  }

  verify(data, signature) {
    return this.decryptWithPublicKey(signature);
  }
}

/**
 * Usage Examples
 */

// Example 1: Using Simple Custom Provider
async function example1() {
  console.log('Example 1: Simple Custom Crypto Provider');
  
  // Mock encryption service (replace with your actual service)
  const mockEncryptionService = {
    encrypt: (data) => Buffer.from(data).toString('hex'),
    decrypt: (encrypted) => Buffer.from(encrypted.toString(), 'hex').toString('utf8')
  };

  const cryptoProvider = new SimpleCryptoProvider(mockEncryptionService);

  const client = WaasClient.newBuilder()
    .setHost(process.env.WAAS_HOST || 'https://api.custody.chainup.com')
    .setAppId(process.env.WAAS_APP_ID)
    .setCryptoProvider(cryptoProvider)
    .build();

  console.log('✓ Client created with custom crypto provider');
}

// Example 2: Using AWS KMS (requires AWS credentials)
async function example2() {
  console.log('\nExample 2: AWS KMS Crypto Provider');
  
  // Uncomment and configure if you have AWS KMS setup
  /*
  const { KMSClient } = require('@aws-sdk/client-kms');
  
  const kmsClient = new KMSClient({
    region: 'us-east-1'
  });

  const cryptoProvider = new AwsKmsCryptoProvider(kmsClient, 'your-key-id');

  const client = WaasClient.newBuilder()
    .setHost(process.env.WAAS_HOST)
    .setAppId(process.env.WAAS_APP_ID)
    .setCryptoProvider(cryptoProvider)
    .build();

  console.log('✓ Client created with AWS KMS crypto provider');
  */
  console.log('(Requires AWS KMS configuration - see code comments)');
}

// Example 3: Using HSM
async function example3() {
  console.log('\nExample 3: HSM Crypto Provider');
  
  // Uncomment and configure if you have HSM setup
  /*
  const hsmClient = initializeHsmClient({
    host: 'hsm.example.com',
    port: 443,
    credentials: {
      username: 'admin',
      password: process.env.HSM_PASSWORD
    }
  });

  const cryptoProvider = new HsmCryptoProvider(hsmClient, 'signing-key-label');

  const client = WaasClient.newBuilder()
    .setHost(process.env.WAAS_HOST)
    .setAppId(process.env.WAAS_APP_ID)
    .setCryptoProvider(cryptoProvider)
    .build();

  console.log('✓ Client created with HSM crypto provider');
  */
  console.log('(Requires HSM configuration - see code comments)');
}

// Example 4: Using Azure Key Vault
async function example4() {
  console.log('\nExample 4: Azure Key Vault Crypto Provider');
  
  // Uncomment and configure if you have Azure Key Vault setup
  /*
  const { KeyClient } = require('@azure/keyvault-keys');
  const { DefaultAzureCredential } = require('@azure/identity');

  const credential = new DefaultAzureCredential();
  const keyClient = new KeyClient(
    'https://your-vault-name.vault.azure.net',
    credential
  );

  const cryptoProvider = new AzureKeyVaultCryptoProvider(keyClient, 'your-key-name');

  const client = WaasClient.newBuilder()
    .setHost(process.env.WAAS_HOST)
    .setAppId(process.env.WAAS_APP_ID)
    .setCryptoProvider(cryptoProvider)
    .build();

  console.log('✓ Client created with Azure Key Vault crypto provider');
  */
  console.log('(Requires Azure Key Vault configuration - see code comments)');
}

// Run examples
async function main() {
  console.log('=== Custom Crypto Provider Examples ===\n');
  
  try {
    await example1();
    await example2();
    await example3();
    await example4();
    
    console.log('\n✅ All examples completed!');
    console.log('\nKey Takeaways:');
    console.log('- Implement ICryptoProvider interface for custom encryption');
    console.log('- Use setCryptoProvider() in WaasClient Builder');
    console.log('- Supports HSM, KMS, and custom encryption services');
    console.log('- Maintains full compatibility with SDK features');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

// Export for use in other modules
module.exports = {
  SimpleCryptoProvider,
  AwsKmsCryptoProvider,
  HsmCryptoProvider,
  AzureKeyVaultCryptoProvider
};
