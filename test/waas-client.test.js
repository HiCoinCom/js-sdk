/**
 * WaaS Client Test Suite
 * Tests for the new WaaS client architecture
 */

const assert = require('assert');
const { WaasClient, WaasConfig } = require('../index');

describe('WaaS Client Tests', function() {
  this.timeout(10000);

  const testConfig = {
    host: process.env.WAAS_HOST || 'https://api.test.custody.com',
    appId: process.env.WAAS_APP_ID || 'test-app-id',
    privateKey: process.env.WAAS_PRIVATE_KEY || '-----BEGIN PRIVATE KEY-----\ntest\n-----END PRIVATE KEY-----',
    publicKey: process.env.WAAS_PUBLIC_KEY || '-----BEGIN PUBLIC KEY-----\ntest\n-----END PUBLIC KEY-----',
  };

  describe('WaasConfig', function() {
    it('should create config with required fields', function() {
      const config = new WaasConfig(testConfig);
      assert.strictEqual(config.host, testConfig.host);
      assert.strictEqual(config.appId, testConfig.appId);
      assert.strictEqual(config.privateKey, testConfig.privateKey);
      assert.strictEqual(config.publicKey, testConfig.publicKey);
    });

    it('should use default values for optional fields', function() {
      const config = new WaasConfig(testConfig);
      assert.strictEqual(config.version, 'v1');
      assert.strictEqual(config.charset, 'UTF-8');
      assert.strictEqual(config.debug, false);
    });

    it('should validate required fields', function() {
      assert.throws(() => {
        const config = new WaasConfig({});
        config.validate();
      }, /host is required/);
    });

    it('should generate correct URL', function() {
      const config = new WaasConfig(testConfig);
      const url = config.getUrl('/test/path');
      assert.strictEqual(url, `${testConfig.host}v1/test/path`);
    });
  });

  describe('WaasClient Builder', function() {
    it('should build client with builder pattern', function() {
      const client = WaasClient.newBuilder()
        .setHost(testConfig.host)
        .setAppId(testConfig.appId)
        .setPrivateKey(testConfig.privateKey)
        .setPublicKey(testConfig.publicKey)
        .setDebug(true)
        .build();

      assert.ok(client);
      assert.strictEqual(client.config.host, testConfig.host);
      assert.strictEqual(client.config.debug, true);
    });

    it('should support method chaining', function() {
      const builder = WaasClient.newBuilder();
      const result = builder.setHost(testConfig.host);
      assert.strictEqual(result, builder);
    });

    it('should throw error when building with incomplete config', function() {
      assert.throws(() => {
        WaasClient.newBuilder()
          .setHost(testConfig.host)
          .build();
      }, /appId is required/);
    });
  });

  describe('WaasClient API Instances', function() {
    let client;

    before(function() {
      client = WaasClient.newBuilder()
        .setHost(testConfig.host)
        .setAppId(testConfig.appId)
        .setPrivateKey(testConfig.privateKey)
        .setPublicKey(testConfig.publicKey)
        .build();
    });

    it('should get UserApi instance', function() {
      const userApi = client.getUserApi();
      assert.ok(userApi);
      assert.strictEqual(typeof userApi.registerByEmail, 'function');
      assert.strictEqual(typeof userApi.registerByPhone, 'function');
      assert.strictEqual(typeof userApi.getUserInfo, 'function');
    });

    it('should get AccountApi instance', function() {
      const accountApi = client.getAccountApi();
      assert.ok(accountApi);
      assert.strictEqual(typeof accountApi.createAccount, 'function');
      assert.strictEqual(typeof accountApi.getBalance, 'function');
      assert.strictEqual(typeof accountApi.getDepositAddress, 'function');
    });

    it('should get BillingApi instance', function() {
      const billingApi = client.getBillingApi();
      assert.ok(billingApi);
      assert.strictEqual(typeof billingApi.getDepositRecords, 'function');
      assert.strictEqual(typeof billingApi.getWithdrawalRecords, 'function');
    });

    it('should get CoinApi instance', function() {
      const coinApi = client.getCoinApi();
      assert.ok(coinApi);
      assert.strictEqual(typeof coinApi.getCoinList, 'function');
      assert.strictEqual(typeof coinApi.getCoinConfig, 'function');
    });

    it('should get TransferApi instance', function() {
      const transferApi = client.getTransferApi();
      assert.ok(transferApi);
      assert.strictEqual(typeof transferApi.transfer, 'function');
      assert.strictEqual(typeof transferApi.withdraw, 'function');
    });

    it('should get AsyncNotifyApi instance', function() {
      const asyncNotifyApi = client.getAsyncNotifyApi();
      assert.ok(asyncNotifyApi);
      assert.strictEqual(typeof asyncNotifyApi.notifyRequest, 'function');
      assert.strictEqual(typeof asyncNotifyApi.verifyRequest, 'function');
      assert.strictEqual(typeof asyncNotifyApi.verifyResponse, 'function');
    });
  });

  describe('CryptoUtil', function() {
    const CryptoUtil = require('../utils/CryptoUtil');
    
    it('should be a class', function() {
      assert.strictEqual(typeof CryptoUtil, 'function');
    });

    it('should create instance with config', function() {
      const config = new WaasConfig(testConfig);
      const cryptoUtil = new CryptoUtil(config);
      assert.ok(cryptoUtil);
    });
  });

  describe('HttpClient', function() {
    const HttpClient = require('../utils/HttpClient');
    
    it('should be a class', function() {
      assert.strictEqual(typeof HttpClient, 'function');
    });

    it('should create instance with config', function() {
      const config = new WaasConfig(testConfig);
      const httpClient = new HttpClient(config);
      assert.ok(httpClient);
    });
  });

  describe('AsyncNotifyApi', function() {
    let client, asyncNotifyApi;

    before(function() {
      client = WaasClient.newBuilder()
        .setHost(testConfig.host)
        .setAppId(testConfig.appId)
        .setPrivateKey(testConfig.privateKey)
        .setPublicKey(testConfig.publicKey)
        .build();
      
      asyncNotifyApi = client.getAsyncNotifyApi();
    });

    it('should have notifyRequest method', function() {
      assert.strictEqual(typeof asyncNotifyApi.notifyRequest, 'function');
    });

    it('should have verifyRequest method', function() {
      assert.strictEqual(typeof asyncNotifyApi.verifyRequest, 'function');
    });

    it('should have verifyResponse method', function() {
      assert.strictEqual(typeof asyncNotifyApi.verifyResponse, 'function');
    });
  });
});
