# ChainUp Custody JavaScript SDK

[![npm version](https://badge.fury.io/js/%40chainup-custody%2Fjs-waas-sdk.svg)](https://www.npmjs.com/package/@chainup-custody/js-waas-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![AI Developed](https://img.shields.io/badge/Developed%20by-AI%20Agent-blueviolet)](https://github.com/anthropics/claude-code)

Official JavaScript/Node.js SDK for [ChainUp Custody](https://custody.chainup.com) - A comprehensive cryptocurrency wallet and custody solution.

> 🤖 **AI Development Notice**: This project was developed and refactored with the assistance of an AI Agent (Claude), including architecture design, code implementation, and documentation.

## Features

- 🔐 **WaaS (Wallet-as-a-Service)** - Complete custody wallet API integration
- 🔑 **MPC (Multi-Party Computation)** - Secure distributed key management
- 🏗️ **Modern Architecture** - Object-oriented design with Builder pattern
- 📝 **Full TypeScript Support** - Comprehensive JSDoc annotations
- ✅ **Production Ready** - Battle-tested in enterprise environments
- 🚀 **Easy Integration** - Simple and intuitive API

## Installation

```bash
npm install @chainup-custody/js-waas-sdk
```

Or using yarn:

```bash
yarn add @chainup-custody/js-waas-sdk
```

## Quick Start

### WaaS (Custody) API

```javascript
const { WaasClient } = require("@chainup-custody/js-waas-sdk");

// Create WaaS client using Builder pattern
const client = WaasClient.newBuilder()
  .setHost("https://api.custody.chainup.com")
  .setAppId("your-app-id")
  .setPrivateKey("-----BEGIN PRIVATE KEY-----\n...")
  .setPublicKey("-----BEGIN PUBLIC KEY-----\n...")
  .setDebug(true)
  .build();

// User operations
const userApi = client.getUserApi();
const user = await userApi.registerByEmail({
  email: "user@example.com",
});

// Account operations
const accountApi = client.getAccountApi();
const balance = await accountApi.getBalance({
  userId: user.id,
  coinType: "BTC",
});

// Transfer operations
const transferApi = client.getTransferApi();
const result = await transferApi.transfer({
  fromUserId: "user1",
  toUserId: "user2",
  coinType: "USDT",
  amount: "100.5",
});
```

### MPC Wallet API

```javascript
const { MpcClient } = require("@chainup-custody/js-waas-sdk");

// Create MPC client
const mpcClient = MpcClient.newBuilder()
  .setAppId("your-app-id")
  .setRsaPrivateKey("-----BEGIN PRIVATE KEY-----\n...")
  .setApiKey("your-api-key")
  .setDomain("https://mpc-api.custody.chainup.com")
  .build();

// Create wallet
const walletApi = mpcClient.getWalletApi();
const wallet = await walletApi.createWallet({
  requestId: "unique-request-id",
  walletName: "My Wallet",
});

// Get deposit address
const depositApi = mpcClient.getDepositApi();
const address = await depositApi.createAddress({
  requestId: "unique-request-id",
  walletId: wallet.id,
  coinType: "ETH",
});

// Withdraw
const withdrawApi = mpcClient.getWithdrawApi();
const withdrawal = await withdrawApi.withdraw({
  requestId: "unique-request-id",
  walletId: wallet.id,
  coinType: "ETH",
  address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  amount: "0.1",
});
```

## API Reference

### WaaS Client APIs

#### UserApi

- `registerByPhone(params)` - Register user with mobile number
- `registerByEmail(params)` - Register user with email
- `getUserInfo(params)` - Get user information
- `getCoinList()` - Get supported coin list

#### AccountApi

- `createAccount(params)` - Create user account
- `getAccountInfo(params)` - Get account information
- `getBalance(params)` - Get account balance
- `getDepositAddress(params)` - Get/create deposit address
- `addDepositAddress(params)` - Add new deposit addresses
- `getAccountList(params)` - Get paginated account list

#### BillingApi

- `getDepositRecords(params)` - Query deposit records
- `getWithdrawalRecords(params)` - Query withdrawal records
- `syncDepositRecords(params)` - Sync deposit records (pagination)
- `syncWithdrawalRecords(params)` - Sync withdrawal records (pagination)
- `getInternalRecords(params)` - Get internal transfer records
- `getTransactionDetails(params)` - Get transaction details

#### CoinApi

- `getCoinList()` - Get supported coins
- `getCoinConfig(params)` - Get coin configuration
- `getHotWalletAddress(params)` - Get hot wallet address
- `getColdWalletAddress(params)` - Get cold wallet address
- `updateHotWalletAddress(params)` - Update hot wallet address
- `updateColdWalletAddress(params)` - Update cold wallet address
- `getBlockchainInfo(params)` - Get blockchain information

#### TransferApi

- `transfer(params)` - Internal transfer between accounts
- `getTransferList(params)` - Query transfer records
- `syncTransferList(params)` - Sync transfer records (pagination)
- `withdraw(params)` - Submit withdrawal request
- `getWithdrawStatus(params)` - Query withdrawal status

#### AsyncNotifyApi

- `verifyNotifySignature(data, signature)` - Verify webhook signature
- `processDepositNotify(data)` - Process deposit notification
- `processWithdrawNotify(data)` - Process withdrawal notification
- `processTransferNotify(data)` - Process transfer notification
- `createNotifyResponse(success, message)` - Create response for webhook

### MPC Client APIs

#### WorkSpaceApi

- `createWorkSpace(params)` - Create workspace
- `getWorkSpaceInfo(params)` - Get workspace information
- `updateWorkSpace(params)` - Update workspace configuration

#### WalletApi

- `createWallet(params)` - Create wallet
- `getWalletList(params)` - Get wallet list
- `getWalletInfo(params)` - Get wallet information
- `updateWallet(params)` - Update wallet configuration

#### DepositApi

- `createAddress(params)` - Create deposit address
- `getAddressList(params)` - Get address list
- `getDepositList(params)` - Get deposit transaction list

#### WithdrawApi

- `withdraw(params)` - Submit withdrawal
- `getWithdrawList(params)` - Get withdrawal list
- `getWithdrawInfo(params)` - Get withdrawal details

#### Web3Api

- `web3Transaction(params)` - Send Web3 transaction
- `getWeb3TransactionList(params)` - Get Web3 transaction list

#### AutoSweepApi

- `createAutoSweep(params)` - Create auto-sweep rule
- `updateAutoSweep(params)` - Update auto-sweep rule
- `getAutoSweepList(params)` - Get auto-sweep rules

#### NotifyApi

- `verifyNotifySignature(data, signature)` - Verify MPC webhook signature

#### TronResourceApi

- `getTronResource(params)` - Get TRON resource information
- `delegateTronResource(params)` - Delegate TRON resources

## Configuration

### Environment Variables

You can use environment variables for configuration:

```bash
# WaaS Configuration
WAAS_HOST=https://api.custody.chainup.com
WAAS_APP_ID=your-app-id
WAAS_PRIVATE_KEY=your-private-key
WAAS_PUBLIC_KEY=chainup-public-key

# MPC Configuration
MPC_DOMAIN=https://mpc-api.custody.chainup.com
MPC_APP_ID=your-mpc-app-id
MPC_API_KEY=your-api-key
MPC_PRIVATE_KEY=your-mpc-private-key
```

### Debug Mode

Enable debug mode to see detailed request/response logs:

```javascript
const client = WaasClient.newBuilder()
  .setHost(process.env.WAAS_HOST)
  .setAppId(process.env.WAAS_APP_ID)
  .setPrivateKey(process.env.WAAS_PRIVATE_KEY)
  .setPublicKey(process.env.WAAS_PUBLIC_KEY)
  .setDebug(true) // Enable debug logging
  .build();
```

## Error Handling

The SDK throws errors for failed requests. Always use try-catch:

```javascript
try {
  const result = await userApi.registerByEmail({
    email: "user@example.com",
  });
  console.log("Registration successful:", result);
} catch (error) {
  console.error("Registration failed:", error.message);
  // Error contains detailed information about the failure
}
```

## Webhook Notifications

Handle asynchronous notifications from ChainUp Custody:

```javascript
const express = require("express");
const { WaasClient } = require("@chainup-custody/js-waas-sdk");

const app = express();
app.use(express.json());

const client = WaasClient.newBuilder()
  // ... configuration
  .build();

const asyncNotifyApi = client.getAsyncNotifyApi();

app.post("/webhook/deposit", (req, res) => {
  const signature = req.headers["x-signature"];
  const notifyData = req.body;

  // Verify signature
  if (!asyncNotifyApi.verifyNotifySignature(notifyData, signature)) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  // Process deposit notification
  const depositInfo = asyncNotifyApi.processDepositNotify(notifyData);
  console.log("Deposit received:", depositInfo);

  // Return success response
  res.json(asyncNotifyApi.createNotifyResponse(true));
});

app.listen(3000, () => {
  console.log("Webhook server running on port 3000");
});
```

## Examples

See the [examples](./examples) directory for more detailed examples:

- [WaaS Basic Operations](./examples/waas-basic.js)
- [MPC Wallet Management](./examples/mpc-wallet.js)
- [Webhook Handler](./examples/webhook-handler.js)
- [Batch Operations](./examples/batch-operations.js)

## Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- test/waas.test.js
npm test -- test/mpc.test.js
```

## Migration from v1.x

If you're upgrading from SDK v1.x, please note:

1. **Old DAO-style APIs** are now deprecated but still available for backward compatibility
2. **New WaasClient** provides better structure and type safety
3. **Update your code** to use the new Builder pattern

### Old Style (v1.x - Deprecated)

```javascript
const { waas } = require("@chainup-custody/js-waas-sdk");
const result = await waas.userApi.registerByEmail({ email: "..." });
```

### New Style (v2.x - Recommended)

```javascript
const { WaasClient } = require('@chainup-custody/js-waas-sdk');
const client = WaasClient.newBuilder()...build();
const userApi = client.getUserApi();
const result = await userApi.registerByEmail({ email: '...' });
```

## Requirements

- Node.js >= 12.0.0
- npm or yarn

## Security

### Encryption Mechanism (Aligned with Java SDK)

The SDK uses RSA asymmetric encryption to protect all API communications:

**Request Encryption Flow:**

1. Business params + `time` + `charset` → JSON string
2. Encrypt with **private key** using RSA segment encryption (234 bytes/block)
3. Send only `app_id` and `data` (encrypted URL-safe Base64)

**Response Decryption Flow:**

1. Server returns encrypted `data` field
2. Decrypt with **public key** using RSA segment decryption (256 bytes/block)
3. Parse JSON to get business data

### Security Features

- ✅ RSA segment encryption/decryption (supports large data)
- ✅ URL-safe Base64 encoding
- ✅ Request timestamp for replay protection
- ✅ Webhook signature verification
- ✅ Secure key management
- ✅ Support for custom crypto implementations (HSM, KMS, etc.)

## Dependencies

- `node-rsa` - RSA encryption
- `request` - HTTP client
- `urlsafe-base64` - URL-safe base64 encoding

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

- **Documentation**: [https://custody-docs.chainup.com](https://custody-docs.chainup.com)
- **GitHub Issues**: [https://github.com/HiCoinCom/js-sdk/issues](https://github.com/HiCoinCom/js-sdk/issues)
- **Email**: custody@chainup.com

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

---

Made with ❤️ by [ChainUp Custody](https://custody.chainup.com)
