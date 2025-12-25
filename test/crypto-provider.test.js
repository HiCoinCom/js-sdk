/**
 * Crypto Provider Tests
 * Tests for ICryptoProvider interface and RsaCryptoProvider implementation
 */

const assert = require('assert');
const ICryptoProvider = require('../utils/ICryptoProvider');
const RsaCryptoProvider = require('../utils/RsaCryptoProvider');

describe('Crypto Provider Tests', function() {
  this.timeout(5000);

  describe('ICryptoProvider Interface', function() {
    it('should be a class', function() {
      assert.strictEqual(typeof ICryptoProvider, 'function');
    });

    it('should throw error for unimplemented encryptWithPrivateKey', function() {
      const provider = new ICryptoProvider();
      assert.throws(() => {
        provider.encryptWithPrivateKey('test');
      }, /must be implemented/);
    });

    it('should throw error for unimplemented decryptWithPublicKey', function() {
      const provider = new ICryptoProvider();
      assert.throws(() => {
        provider.decryptWithPublicKey('test');
      }, /must be implemented/);
    });
  });

  describe('RsaCryptoProvider', function() {
    const testPrivateKey = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7VJTUt9Us8cKj
MzEfYyjiWA4R4/M2bS1+fWIcPm15A8K5mz1zRpVMOvwI0L1gH3pnZfDqME7BZMCD
8PqZmIg6r5bXTJ3WNNhLYTvR5WmvMh8QH3jdKT4DVfHxHR8VbuMY7VdvIzhgf4W3
kqk5n0h6PAXdQJXGWCOwlGhOb7k0lbPVVshMcgHnPVU5HnrYdjrOQ0HWkGn9dhWp
K3VQJZp4ypXBYYnGPvTBo9NG3LqF4U8K8+4u8y9RzBs9e8RaCLq+Fqp0qJBfYrm6
bKOEkJCt5XHfwB8SkPNuODCIJmXqWpHaKG18w4R1NQRNHl3ZJgPvgCKGVKJDkJ+M
test-key-data
-----END PRIVATE KEY-----`;

    const testPublicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu1SU1LfVLPHCozMxH2Mo
4lgOEePzNm0tfn1iHD5teQPCuZs9c0aVTDr8CNC9YB96Z2Xw6jBOwWTAg/D6mZiI
Oq+W10yd1jTYS2E70eVprzIfEB943Sk+A1Xx8R0fFW7jGO1XbyM4YH+Ft5KpOZ9I
ejwF3UCVxlgjsJRoTm+5NJWz1VbITHIB5z1VOR562HY6zkNB1pBp/XYVqSt1UCWa
eMqVwWGJxj70waPTRty6heFPCvPuLvMvUcwbPXvEWgi6vhaqdKiQX2K5umyjhJCQ
reVx38AfEpDzbjgwiCZl6lqR2ihtfMOEdTUETR5d2SYD74AihlSiQ5CfjA==
-----END PUBLIC KEY-----`;

    it('should create provider with keys', function() {
      const provider = new RsaCryptoProvider({
        privateKey: testPrivateKey,
        publicKey: testPublicKey
      });
      
      assert.ok(provider);
      assert.strictEqual(provider.privateKey, testPrivateKey);
      assert.strictEqual(provider.publicKey, testPublicKey);
    });

    it('should implement ICryptoProvider', function() {
      const provider = new RsaCryptoProvider({
        privateKey: testPrivateKey,
        publicKey: testPublicKey
      });
      
      assert.ok(provider instanceof ICryptoProvider);
    });

    it('should have encrypt and decrypt methods', function() {
      const provider = new RsaCryptoProvider({
        privateKey: testPrivateKey,
        publicKey: testPublicKey
      });
      
      assert.strictEqual(typeof provider.encryptWithPrivateKey, 'function');
      assert.strictEqual(typeof provider.decryptWithPublicKey, 'function');
      assert.strictEqual(typeof provider.sign, 'function');
      assert.strictEqual(typeof provider.verify, 'function');
    });
  });

  describe('Custom Crypto Provider', function() {
    class CustomCryptoProvider extends ICryptoProvider {
      encryptWithPrivateKey(data) {
        return Buffer.from(data).toString('base64');
      }

      decryptWithPublicKey(encryptedData) {
        return Buffer.from(encryptedData, 'base64').toString('utf8');
      }
    }

    it('should allow custom implementation', function() {
      const provider = new CustomCryptoProvider();
      
      const original = 'test data';
      const encrypted = provider.encryptWithPrivateKey(original);
      const decrypted = provider.decryptWithPublicKey(encrypted);
      
      assert.strictEqual(decrypted, original);
    });

    it('should work with sign/verify aliases', function() {
      const provider = new CustomCryptoProvider();
      
      const original = 'test data';
      const signature = provider.sign(original);
      const verified = provider.verify(signature);
      
      assert.strictEqual(verified, original);
    });
  });
});
