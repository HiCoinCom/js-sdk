/**
 * ChainUp Custody JavaScript SDK
 * Main entry point for WaaS (Wallet-as-a-Service) and MPC (Multi-Party Computation) APIs
 * 
 * @module chainup-custody-sdk
 * @author ChainUp Custody
 * @version 2.0.0
 * @license MIT
 */

// ============== WaaS (Custody) Clients ==============
const WaasClient = require('./custody/WaasClient');
const WaasConfig = require('./custody/WaasConfig');

// ============== MPC Clients ==============
const MpcClient = require('./mpc/MpcClient');
const MpcConfig = require('./mpc/MpcConfig');

// ============== Utilities ==============
const Constants = require('./utils/Constants');
const MpcConstants = require('./utils/MpcConstants');
const ICryptoProvider = require('./utils/ICryptoProvider');
const RsaCryptoProvider = require('./utils/RsaCryptoProvider');
const HttpClient = require('./utils/HttpClient');
const MpcHttpClient = require('./utils/MpcHttpClient');
// Legacy utilities kept for backward compatibility
const RSAUtil = require('./utils/RSAUtil');
const CryptoUtil = require('./utils/CryptoUtil'); // Deprecated, use RsaCryptoProvider

// ============== Main Exports ==============
module.exports = {
    // ========== WaaS (Custody) Clients ==========
    /**
     * WaaS Client - Modern OOP-based client for Custody API
     * @example
     * const client = WaasClient.newBuilder()
     *   .setHost('https://api.custody.com')
     *   .setAppId('your-app-id')
     *   .setPrivateKey('your-private-key')
     *   .setPublicKey('chainup-public-key')
     *   .build();
     * 
     * const userApi = client.getUserApi();
     * const result = await userApi.registerByEmail({ email: 'user@example.com' });
     */
    WaasClient,
    WaasConfig,
    
    // ========== MPC Clients ==========
    /**
     * MPC Client - Client for Multi-Party Computation Wallet API
     * @example
     * const mpcClient = MpcClient.newBuilder()
     *   .setAppId('your-app-id')
     *   .setRsaPrivateKey('your-private-key')
     *   .setApiKey('your-api-key')
     *   .setDomain('https://mpc-api.custody.com')
     *   .build();
     * 
     * const walletApi = mpcClient.getWalletApi();
     */
    MpcClient,
    MpcConfig,
    MpcClientFactory: MpcClient, // Alias for backward compatibility
    
    // ========== Crypto Providers ==========
    /**
     * Crypto provider interfaces for custom encryption implementations
     */
    ICryptoProvider,
    RsaCryptoProvider,
    
    // ========== Utilities ==========
    utils: {
        // Core utilities
        Constants,
        MpcConstants,
        
        // Crypto providers
        ICryptoProvider,
        RsaCryptoProvider,
        
        // HTTP clients
        HttpClient,
        MpcHttpClient,
        
        // Legacy (deprecated but kept for compatibility)
        RSAUtil,
        CryptoUtil // Use RsaCryptoProvider instead
    }
};
