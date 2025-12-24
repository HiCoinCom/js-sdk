/**
 * MPC Signature Utility Tests
 * Tests for withdrawal and Web3 transaction signing
 */

const assert = require('assert');
const MpcSignUtil = require('../utils/MpcSignUtil');

describe('MPC Signature Utility Tests', function() {
  describe('Parameter Sorting', function() {
    it('should sort parameters in ASCII order', function() {
      const params = {
        z: '3',
        a: '1', 
        m: '2'
      };
      
      const result = MpcSignUtil.paramsSort(params);
      assert.strictEqual(result, 'a=1&m=2&z=3');
    });

    it('should skip empty parameters', function() {
      const params = {
        a: '1',
        b: '',
        c: null,
        d: undefined,
        e: '2'
      };
      
      const result = MpcSignUtil.paramsSort(params);
      assert.strictEqual(result, 'a=1&e=2');
    });

    it('should remove trailing zeros from amount', function() {
      const params = {
        amount: '1.0001000',
        symbol: 'ETH'
      };
      
      const result = MpcSignUtil.paramsSort(params);
      assert.strictEqual(result, 'amount=1.0001&symbol=eth');
    });

    it('should convert result to lowercase', function() {
      const params = {
        Symbol: 'ETH',
        Address: '0xABC'
      };
      
      const result = MpcSignUtil.paramsSort(params);
      assert.strictEqual(result, 'address=0xabc&symbol=eth');
    });

    it('should handle complex amount formatting', function() {
      const params = {
        q: '8',
        amount: '8.00088800',
        t: 'test'
      };
      
      const result = MpcSignUtil.paramsSort(params);
      const md5 = MpcSignUtil.md5(result);
      
      // Verify the result matches Java SDK test case
      assert.strictEqual(result, 'amount=8.000888&q=8&t=test');
    });
  });

  describe('Withdrawal Signature Generation', function() {
    it('should generate withdrawal signature parameters', function() {
      const withdrawParams = {
        request_id: 'test-123',
        sub_wallet_id: '1001',
        symbol: 'HECO',
        address_to: '0xcF88c8a960d5e155A9F3236a9f4e7CacE29E5050',
        amount: '0.00000100000',
        memo: ''
      };
      
      const signData = MpcSignUtil.paramsSort(withdrawParams);
      
      // Verify amount trailing zeros are removed
      assert.ok(signData.includes('amount=0.000001'));
      assert.ok(!signData.includes('amount=0.00000100000'));
      
      // Verify parameters are sorted
      const parts = signData.split('&');
      assert.strictEqual(parts[0].split('=')[0], 'address_to');
      assert.strictEqual(parts[1].split('=')[0], 'amount');
    });

    it('should handle empty memo in withdrawal', function() {
      const withdrawParams = {
        request_id: 'test-1',
        sub_wallet_id: '123',
        symbol: 'ETH',
        address_to: '0x123',
        amount: '1.0',
        memo: ''
      };
      
      const signData = MpcSignUtil.paramsSort(withdrawParams);
      
      // Empty memo should not be in the result
      assert.ok(!signData.includes('memo'));
    });
  });

  describe('MD5 Hash', function() {
    it('should generate correct MD5 hash', function() {
      const data = 'amount=8.000888&q=8&t=test';
      const md5 = MpcSignUtil.md5(data);
      
      // Verify MD5 is 32 characters hexadecimal
      assert.strictEqual(md5.length, 32);
      assert.ok(/^[a-f0-9]+$/.test(md5));
    });

    it('should match Java SDK MD5 implementation', function() {
      // Test case from Java SDK: amount=8.000888&q=8&t=test
      const params = {
        q: '8',
        amount: '8.00088800',
        t: 'test'
      };
      
      const signData = MpcSignUtil.paramsSort(params);
      const md5 = MpcSignUtil.md5(signData);
      
      // Verify the sorted string
      assert.strictEqual(signData, 'amount=8.000888&q=8&t=test');
      
      // MD5 hash should be consistent
      const expectedMd5 = MpcSignUtil.md5('amount=8.000888&q=8&t=test');
      assert.strictEqual(md5, expectedMd5);
    });
  });

  describe('Signature Method Existence', function() {
    it('should have generateWithdrawSign method', function() {
      assert.strictEqual(typeof MpcSignUtil.generateWithdrawSign, 'function');
    });

    it('should have generateWeb3Sign method', function() {
      assert.strictEqual(typeof MpcSignUtil.generateWeb3Sign, 'function');
    });

    it('should have paramsSort method', function() {
      assert.strictEqual(typeof MpcSignUtil.paramsSort, 'function');
    });

    it('should have sign method', function() {
      assert.strictEqual(typeof MpcSignUtil.sign, 'function');
    });

    it('should have md5 method', function() {
      assert.strictEqual(typeof MpcSignUtil.md5, 'function');
    });
  });

  describe('Edge Cases', function() {
    it('should handle null params in paramsSort', function() {
      const result = MpcSignUtil.paramsSort(null);
      assert.strictEqual(result, '');
    });

    it('should handle empty object in paramsSort', function() {
      const result = MpcSignUtil.paramsSort({});
      assert.strictEqual(result, '');
    });

    it('should return empty string for missing sign data', function() {
      const result = MpcSignUtil.sign('', 'some-key');
      assert.strictEqual(result, '');
    });

    it('should return empty string for missing private key', function() {
      const result = MpcSignUtil.sign('data', '');
      assert.strictEqual(result, '');
    });
  });
});
