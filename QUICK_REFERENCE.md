# ChainUp Custody JS SDK - 快速参考

## 📦 安装

```bash
npm install @chainup-custody/js-waas-sdk
```

## 🚀 基本使用

### MPC Client

```javascript
const { MpcClient } = require("@chainup-custody/js-waas-sdk");

// 创建客户端
const client = MpcClient.newBuilder()
  .setAppId("your-app-id")
  .setRsaPrivateKey("-----BEGIN PRIVATE KEY-----\n...")
  .setApiKey("your-api-key")
  .setDomain("https://openapi.chainup.com")
  .setSignPrivateKey("-----BEGIN PRIVATE KEY-----\n...") // 可选：用于签名
  .build();

// 使用 API
const walletApi = client.getWalletApi();
const withdrawApi = client.getWithdrawApi();
const web3Api = client.getWeb3Api();
```

## 📖 API 参数格式

### ⚠️ 重要说明

- **JavaScript 代码中**: 使用 `camelCase` (如 `requestId`, `subWalletId`)
- **JSDoc 文档中**: 显示 `snake_case` (如 `request_id`, `sub_wallet_id`)
- **实际 API 调用**: 自动转换为 `snake_case`

### 示例对照

```javascript
// ✅ 正确的用法（两种方式都可以）

// 方式1：JavaScript 风格（推荐）
await withdrawApi.withdraw({
  requestId: "unique-id", // 输入 camelCase
  subWalletId: 123,
  symbol: "ETH",
  amount: "0.1",
  addressTo: "0x...",
});

// 方式2：API 风格（也可以）
await withdrawApi.withdraw({
  request_id: "unique-id", // 直接使用 snake_case
  sub_wallet_id: 123,
  symbol: "ETH",
  amount: "0.1",
  address_to: "0x...",
});
```

## 🔐 TypeScript 支持

```typescript
import {
  MpcClient,
  WithdrawParams,
  WalletInfo,
  ApiResponse,
} from "@chainup-custody/js-waas-sdk";

// 完整的类型检查
const params: WithdrawParams = {
  request_id: "unique-id",
  sub_wallet_id: 123,
  symbol: "ETH",
  amount: "0.1",
  address_to: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
};

const result: Promise<ApiResponse<WithdrawResult>> =
  withdrawApi.withdraw(params);
```

## 📋 常用参数对照表

| JavaScript          | JSDoc/API             | 说明     |
| ------------------- | --------------------- | -------- |
| requestId           | request_id            | 请求ID   |
| subWalletId         | sub_wallet_id         | 子钱包ID |
| walletName          | sub_wallet_name       | 钱包名称 |
| showStatus          | app_show_status       | 显示状态 |
| addressTo           | address_to            | 目标地址 |
| addressFrom         | address_from          | 源地址   |
| pageSize            | page_size             | 分页大小 |
| maxId               | max_id                | 最大ID   |
| chainId             | chain_id              | 链ID     |
| fromAddr            | from_addr             | From地址 |
| toAddr              | to_addr               | To地址   |
| gasPrice            | gas_price             | Gas价格  |
| gasLimit            | gas_limit             | Gas限制  |
| needTransactionSign | need_transaction_sign | 是否签名 |

## 🎯 API 快速索引

### WalletApi - 钱包管理

```javascript
const walletApi = client.getWalletApi();

// 创建钱包
await walletApi.createWallet({
  request_id: "unique-id",
  sub_wallet_name: "My Wallet",
});

// 获取钱包列表
await walletApi.getWalletList({ page: 1, page_size: 10 });

// 获取钱包资产
await walletApi.getWalletAssets({ sub_wallet_id: 123 });
```

### WithdrawApi - 提现管理

```javascript
const withdrawApi = client.getWithdrawApi();

// 发起提现（无签名）
await withdrawApi.withdraw({
  request_id: "unique-id",
  sub_wallet_id: 123,
  symbol: "ETH",
  amount: "0.1",
  address_to: "0x...",
});

// 发起提现（带签名）
await withdrawApi.withdraw({
  request_id: "unique-id",
  sub_wallet_id: 123,
  symbol: "ETH",
  amount: "0.1",
  address_to: "0x...",
  need_transaction_sign: true, // 需要配置 signPrivateKey
});

// 查询提现记录
await withdrawApi.getWithdrawRecords({
  request_ids: ["id1", "id2"],
});
```

### Web3Api - Web3 交易

```javascript
const web3Api = client.getWeb3Api();

// 创建 Web3 交易
await web3Api.createWeb3Trans({
  request_id: "unique-id",
  sub_wallet_id: 123,
  chain_id: 1,
  from_addr: "0x...",
  to_addr: "0x...",
  value: "1000000000000000000",
});

// 加速交易
await web3Api.accelerationWeb3Trans({
  trans_id: 12345,
  gas_price: "50",
  gas_limit: "21000",
});
```

### DepositApi - 充值管理

```javascript
const depositApi = client.getDepositApi();

// 获取充值记录
await depositApi.getDepositRecords({
  request_ids: ["id1", "id2"],
});

// 同步充值记录
await depositApi.syncDepositRecords({ max_id: 0 });
```

### AutoSweepApi - 自动归集

```javascript
const autoSweepApi = client.getAutoSweepApi();

// 配置自动归集
await autoSweepApi.autoCollectSubWallets({
  sub_wallet_ids: [123, 456],
});

// 设置币种自动归集状态
await autoSweepApi.setAutoCollectSymbol({
  symbol: "USDTERC20",
  auto_collect_status: 1, // 1=启用, 2=禁用
});
```

### TronResourceApi - TRON 资源

```javascript
const tronApi = client.getTronResourceApi();

// 购买 TRON 资源
await tronApi.createTronDelegate({
  request_id: "unique-id",
  receiver_address: "TXxxx...",
  resource: 0, // 0=BANDWIDTH, 1=ENERGY
  amount: 100,
});
```

### NotifyApi - Webhook 通知

```javascript
const notifyApi = client.getNotifyApi();

// 解密通知数据
const notifyData = notifyApi.notifyRequest(cipher);
console.log(notifyData);
// {
//   id: 123,
//   request_id: 'xxx',
//   sub_wallet_id: 456,
//   symbol: 'ETH',
//   amount: '0.1',
//   ...
// }
```

## ⚙️ 配置选项

### MpcConfig

```javascript
const client = MpcClient.newBuilder()
  .setAppId("your-app-id") // 必填：应用ID
  .setRsaPrivateKey("...") // 必填：RSA私钥
  .setApiKey("your-api-key") // 必填：API密钥
  .setDomain("https://...") // 必填：API域名
  .setSignPrivateKey("...") // 可选：签名私钥（提现/Web3签名用）
  .setDebug(true) // 可选：调试模式
  .build();
```

## 🔍 错误处理

```javascript
try {
  const result = await withdrawApi.withdraw(params);
  console.log("Success:", result.data);
} catch (error) {
  console.error("Error:", error.message);
  // 处理错误
}
```

## 📚 完整文档

- [API 文档更新说明](./docs/API_DOCUMENTATION_UPDATE.md)
- [TypeScript 类型定义](./mpc/types/index.d.ts)
- [ChainUp Custody 官方文档](https://custodydocs-zh.chainup.com)

---

**版本**: v2.1.0  
**更新**: 2025-12-24
