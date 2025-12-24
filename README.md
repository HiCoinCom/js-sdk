# ChainUp Custody JavaScript SDK

[![npm version](https://badge.fury.io/js/%40chainup-custody%2Fjs-waas-sdk.svg)](https://www.npmjs.com/package/@chainup-custody/js-waas-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![AI Developed](https://img.shields.io/badge/Developed%20by-AI%20Agent-blueviolet)](https://github.com/anthropics/claude-code)

ChainUp Custody 官方 JavaScript/Node.js SDK - 为数字资产托管提供完整的解决方案。

> 🤖 **AI 开发声明**: 本项目代码由 AI Agent (Claude) 协助完成开发和重构，包括架构设计、代码实现、文档编写等。

[English Documentation](./README_EN.md) | [重构总结](./REFACTORING_SUMMARY.md)

## ✨ 特性

- 🔐 **WaaS（钱包即服务）** - 完整的托管钱包 API 集成
- 🔑 **MPC（多方计算）** - 安全的分布式密钥管理
- 🏗️ **现代架构** - 面向对象设计，使用 Builder 模式
- 📝 **完整的类型支持** - 全面的 JSDoc 注释
- ✅ **生产就绪** - 经过企业级环境验证
- 🚀 **易于集成** - 简单直观的 API
- 🔒 **与 Java SDK 一致** - 请求/响应加密流程完全对齐

## 📦 安装

```bash
npm install @chainup-custody/js-waas-sdk
```

或使用 yarn:

```bash
yarn add @chainup-custody/js-waas-sdk
```

## 🚀 快速开始

### WaaS（托管）API

```javascript
const { WaasClient } = require("@chainup-custody/js-waas-sdk");

// 使用 Builder 模式创建 WaaS 客户端
const client = WaasClient.newBuilder()
  .setHost("https://api.custody.chainup.com")
  .setAppId("your-app-id")
  .setPrivateKey("-----BEGIN PRIVATE KEY-----\n...")
  .setPublicKey("-----BEGIN PUBLIC KEY-----\n...")
  .setDebug(true)
  .build();

// 用户操作
const userApi = client.getUserApi();
const user = await userApi.registerByEmail({
  email: "user@example.com",
});

// 账户操作
const accountApi = client.getAccountApi();
const balance = await accountApi.getBalance({
  userId: user.id,
  coinType: "BTC",
});

// 转账操作
const transferApi = client.getTransferApi();
const result = await transferApi.transfer({
  fromUserId: "user1",
  toUserId: "user2",
  coinType: "USDT",
  amount: "100.5",
});
```

### MPC 钱包 API

```javascript
const { MpcClient } = require("@chainup-custody/js-waas-sdk");

// 创建 MPC 客户端
const mpcClient = MpcClient.newBuilder()
  .setAppId("your-app-id")
  .setRsaPrivateKey("-----BEGIN PRIVATE KEY-----\n...")
  .setApiKey("your-api-key")
  .setDomain("https://mpc-api.custody.chainup.com")
  .setSignPrivateKey("-----BEGIN PRIVATE KEY-----\n...") // 可选：用于提现/Web3交易签名
  .build();

// 创建钱包
const walletApi = mpcClient.getWalletApi();
const wallet = await walletApi.createWallet({
  requestId: "unique-request-id",
  walletName: "My Wallet",
});

// 提现（不使用签名）
const withdrawApi = mpcClient.getWithdrawApi();
const result1 = await withdrawApi.withdraw({
  requestId: "unique-request-id",
  subWalletId: wallet.id,
  symbol: "ETH",
  amount: "0.1",
  addressTo: "0x123...",
});

// 提现（使用签名，增强安全性）
const result2 = await withdrawApi.withdraw({
  requestId: "unique-request-id",
  subWalletId: wallet.id,
  symbol: "ETH",
  amount: "0.1",
  addressTo: "0x123...",
  needTransactionSign: true, // 启用交易签名
});
```

#### 交易签名说明

MPC 提现和 Web3 交易支持可选的 RSA 签名功能：

- **配置**: 使用 `setSignPrivateKey()` 设置签名私钥
- **启用**: 在调用 `withdraw()` 或 `createWeb3Trans()` 时设置 `needTransactionSign: true`
- **签名规则**:
  - 参数按 ASCII 升序排序
  - 空值不参与签名
  - 数字去除尾部零（如 `1.0001000` → `1.0001`）
  - 使用 MD5 + RSA-SHA256 签名

详细说明请参考 [MPC 签名指南](./docs/MPC_SIGN_GUIDE.md)。

### 使用自定义加密提供者

SDK 支持自定义加密实现（如 HSM、KMS 等）：

```javascript
const { WaasClient, ICryptoProvider } = require("@chainup-custody/js-waas-sdk");

// 实现自定义加密提供者
class MyCustomCryptoProvider extends ICryptoProvider {
  constructor(hsmClient) {
    super();
    this.hsmClient = hsmClient;
  }

  encryptWithPrivateKey(data) {
    // 使用 HSM/KMS 进行加密
    return this.hsmClient.encrypt(data);
  }

  decryptWithPublicKey(encryptedData) {
    // 使用 HSM/KMS 进行解密
    return this.hsmClient.decrypt(encryptedData);
  }

  sign(data) {
    return this.hsmClient.sign(data);
  }

  verify(data, signature) {
    return this.hsmClient.verify(data, signature);
  }
}

// 使用自定义加密提供者
const client = WaasClient.newBuilder()
  .setHost("https://api.custody.chainup.com")
  .setAppId("your-app-id")
  .setCryptoProvider(new MyCustomCryptoProvider(myHsmClient))
  .build();
```

## 📚 API 参考

### WaaS 客户端 APIs

#### UserApi - 用户管理

- `registerByPhone(params)` - 手机号注册用户
- `registerByEmail(params)` - 邮箱注册用户
- `getUserInfo(params)` - 获取用户信息
- `getCoinList()` - 获取支持的币种列表

#### AccountApi - 账户管理

- `createAccount(params)` - 创建用户账户
- `getAccountInfo(params)` - 获取账户信息
- `getBalance(params)` - 获取账户余额
- `getDepositAddress(params)` - 获取/创建充值地址
- `addDepositAddress(params)` - 添加新的充值地址
- `getAccountList(params)` - 获取账户列表（分页）

#### BillingApi - 账单管理

- `getDepositRecords(params)` - 查询充值记录
- `getWithdrawalRecords(params)` - 查询提现记录
- `syncDepositRecords(params)` - 同步充值记录（分页）
- `syncWithdrawalRecords(params)` - 同步提现记录（分页）
- `getInternalRecords(params)` - 获取内部转账记录
- `getTransactionDetails(params)` - 获取交易详情

#### CoinApi - 币种管理

- `getCoinList()` - 获取支持的币种
- `getCoinConfig(params)` - 获取币种配置
- `getHotWalletAddress(params)` - 获取热钱包地址
- `getColdWalletAddress(params)` - 获取冷钱包地址
- `updateHotWalletAddress(params)` - 更新热钱包地址
- `updateColdWalletAddress(params)` - 更新冷钱包地址
- `getBlockchainInfo(params)` - 获取区块链信息

#### TransferApi - 转账管理

- `transfer(params)` - 内部账户转账
- `getTransferList(params)` - 查询转账记录
- `syncTransferList(params)` - 同步转账记录（分页）
- `withdraw(params)` - 提交提现请求
- `getWithdrawStatus(params)` - 查询提现状态

#### AsyncNotifyApi - 异步通知

- `verifyNotifySignature(data, signature)` - 验证 webhook 签名
- `processDepositNotify(data)` - 处理充值通知
- `processWithdrawNotify(data)` - 处理提现通知
- `processTransferNotify(data)` - 处理转账通知
- `createNotifyResponse(success, message)` - 创建 webhook 响应

### MPC 客户端 APIs

#### WorkSpaceApi - 工作空间管理

- `createWorkSpace(params)` - 创建工作空间
- `getWorkSpaceInfo(params)` - 获取工作空间信息
- `updateWorkSpace(params)` - 更新工作空间配置

#### WalletApi - 钱包管理

- `createWallet(params)` - 创建钱包
- `getWalletList(params)` - 获取钱包列表
- `getWalletInfo(params)` - 获取钱包信息
- `updateWallet(params)` - 更新钱包配置

#### DepositApi - 充值管理

- `createAddress(params)` - 创建充值地址
- `getAddressList(params)` - 获取地址列表
- `getDepositList(params)` - 获取充值交易列表

#### WithdrawApi - 提现管理

- `withdraw(params)` - 提交提现
- `getWithdrawList(params)` - 获取提现列表
- `getWithdrawInfo(params)` - 获取提现详情

更多 API 详情请参考 [完整文档](./README_EN.md)。

## 🎯 使用示例

查看 [examples](./examples) 目录获取更详细的示例：

- [WaaS 基础操作](./examples/waas-basic.js) - 用户注册、账户管理、转账等
- [MPC 钱包管理](./examples/mpc-wallet.js) - 钱包创建、充值、提现等
- [Webhook 处理](./examples/webhook-handler.js) - 异步通知集成

### Webhook 异步通知处理

SDK 提供了 NotifyApi 来解密 webhook 通知数据。SDK **仅负责解密**，签名验证应由应用层实现：

```javascript
const express = require('express');
const { WaasClient, MpcClient } = require('@chainup-custody/js-waas-sdk');

const app = express();
app.use(express.json());

// WaaS 通知处理
app.post('/webhook/waas', async (req, res) => {
  const { cipher } = req.body;

  const waasClient = WaasClient.newBuilder()...build();
  const asyncNotifyApi = waasClient.getAsyncNotifyApi();

  try {
    // SDK 仅解密通知数据
    const notifyData = asyncNotifyApi.notifyRequest(cipher);

    // 应用层处理业务逻辑和签名验证
    await handleDepositNotification(notifyData);

    res.json({ code: 0, message: 'success' });
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ code: -1, message: error.message });
  }
});

// MPC 通知处理
app.post('/webhook/mpc', async (req, res) => {
  const { cipher } = req.body;

  const mpcClient = MpcClient.newBuilder()...build();
  const notifyApi = mpcClient.getNotifyApi();

  try {
    // SDK 仅解密通知数据
    const notifyData = notifyApi.notifyRequest(cipher);

    // 应用层处理业务逻辑
    await handleMpcNotification(notifyData);

    res.json({ code: 0, message: 'success' });
  } catch (error) {
    res.status(500).json({ code: -1, message: error.message });
  }
});

// WaaS 提现验证流程
app.post('/webhook/waas/verify', async (req, res) => {
  const { cipher } = req.body;

  const waasClient = WaasClient.newBuilder()...build();
  const asyncNotifyApi = waasClient.getAsyncNotifyApi();

  try {
    // 1. 解密验证请求
    const verifyRequest = asyncNotifyApi.verifyRequest(cipher);

    // 2. 应用层进行验证（风控、合规检查等）
    const isApproved = await performWithdrawVerification(verifyRequest);

    // 3. 加密响应
    const response = asyncNotifyApi.verifyResponse({
      withdraw_id: verifyRequest.withdraw_id,
      status: isApproved ? 1 : 2,  // 1=通过, 2=拒绝
      reason: isApproved ? '' : 'Risk check failed'
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ code: -1, message: error.message });
  }
});
```

## 🔧 配置

### 环境变量

```bash
# WaaS 配置
WAAS_HOST=https://api.custody.chainup.com
WAAS_APP_ID=your-app-id
WAAS_PRIVATE_KEY=your-private-key
WAAS_PUBLIC_KEY=chainup-public-key

# MPC 配置
MPC_DOMAIN=https://mpc-api.custody.chainup.com
MPC_APP_ID=your-mpc-app-id
MPC_API_KEY=your-api-key
MPC_PRIVATE_KEY=your-mpc-private-key
```

### 调试模式

启用调试模式以查看详细的请求/响应日志：

```javascript
const client = WaasClient.newBuilder()
  .setHost(process.env.WAAS_HOST)
  .setAppId(process.env.WAAS_APP_ID)
  .setPrivateKey(process.env.WAAS_PRIVATE_KEY)
  .setPublicKey(process.env.WAAS_PUBLIC_KEY)
  .setDebug(true) // 启用调试日志
  .build();
```

## 🔐 安全性

### 加密机制（与 Java SDK 一致）

SDK 使用 RSA 非对称加密保护所有 API 通信：

**请求加密流程:**

1. 业务参数 + `time` + `charset` → JSON 字符串
2. 使用**私钥**进行 RSA 分段加密（234 字节/块）
3. 只发送 `app_id` 和 `data`（加密后的 URL-safe Base64）

**响应解密流程:**

1. 服务端返回加密的 `data` 字段
2. 使用**公钥**进行 RSA 分段解密（256 字节/块）
3. 解析 JSON 获取业务数据

### 安全特性

- ✅ RSA 分段加密/解密（支持大数据）
- ✅ URL-safe Base64 编码
- ✅ 请求时间戳防重放
- ✅ Webhook 签名验证
- ✅ 安全的密钥管理
- ✅ 支持自定义加密实现（HSM、KMS 等）
- ✅ 依赖注入模式实现加密解耦

## 🧪 测试

```bash
# 运行所有测试
npm test

# 运行特定测试
npm test -- test/waas-client.test.js
npm test -- test/crypto-provider.test.js
```

测试结果：

```
✔ 30 passing (16ms)
```

## 📖 文档

- [English README](./README_EN.md) - 完整的英文文档
- [重构总结](./REFACTORING_SUMMARY.md) - 架构和设计说明
- [API 文档](https://custody-docs.chainup.com) - 官方 API 文档
- [JSDoc 注释](./custody/api/) - 代码内联文档

## 🔄 从 v1.x 迁移

### 旧方式（v1.x - 已废弃）

```javascript
const { waas } = require("@chainup-custody/js-waas-sdk");
const result = await waas.userApi.registerByEmail({ email: "..." });
```

### 新方式（v2.x - 推荐）

```javascript
const { WaasClient } = require('@chainup-custody/js-waas-sdk');
const client = WaasClient.newBuilder()...build();
const userApi = client.getUserApi();
const result = await userApi.registerByEmail({ email: '...' });
```

**注意**: v1.x 风格的 API 仍然可用，但标记为废弃。建议迁移到新的 API。

## 💡 设计模式

本 SDK 采用了多种设计模式以提供最佳的开发体验：

- **Builder 模式** - 灵活的客户端配置
- **Factory 模式** - API 实例创建
- **Strategy 模式** - 可扩展的 API 实现
- **Singleton 模式** - 资源复用
- **Dependency Injection** - 加密提供者解耦
- **Interface Segregation** - ICryptoProvider 接口抽象

详细说明请参考 [重构总结](./REFACTORING_SUMMARY.md)。

## 📋 系统要求

- Node.js >= 12.0.0
- npm 或 yarn

## 📦 依赖

- `node-rsa` - RSA 加密
- `request` - HTTP 客户端
- `urlsafe-base64` - URL 安全的 base64 编码

## 🤝 贡献

欢迎提交 Pull Request！

## 📞 支持

- **文档**: [https://custody-docs.chainup.com](https://custody-docs.chainup.com)
- **GitHub Issues**: [https://github.com/HiCoinCom/js-sdk/issues](https://github.com/HiCoinCom/js-sdk/issues)
- **邮箱**: custody@chainup.com

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 📝 更新日志

查看 [CHANGELOG.md](CHANGELOG.md) 了解版本历史和更新内容。

---

**版本**: 2.1.1  
**最后更新**: 2025-12-24  
**维护者**: ChainUp Custody Team

用 ❤️ 构建 by [ChainUp Custody](https://custody.chainup.com)
