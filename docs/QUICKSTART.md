# ChainUp Custody JS SDK - 快速入门指南

## 安装

```bash
npm install @chainup-custody/js-waas-sdk@2.0.0
```

## 基本使用

### MPC API 快速开始

#### 1. 创建 MPC 客户端

```javascript
const { MpcClientFactory } = require("@chainup-custody/js-waas-sdk/MpcClient");

const mpcClient = MpcClientFactory.createClient({
  appId: "your_app_id", // 你的应用 ID
  privateKey: "your_merchant_private_key", // 你的商户私钥
  publicKey: "your_chainup_public_key", // ChainUp 公钥
  host: "https://openapi.chainup.com", // API 地址
  debug: false, // 是否启用调试模式
});
```

#### 2. 创建钱包

```javascript
const wallet = await mpcClient.getWalletApi().createWallet({
  sub_wallet_name: "My First Wallet",
  app_show_status: 1, // 1=显示, 2=隐藏
});

console.log("钱包 ID:", wallet.sub_wallet_id);
```

#### 3. 创建地址

```javascript
const address = await mpcClient.getWalletApi().createWalletAddress({
  sub_wallet_id: wallet.sub_wallet_id,
  symbol: "ETH", // 币种标识
});

console.log("地址:", address.address);
```

#### 4. 查询余额

```javascript
const assets = await mpcClient.getWalletApi().getWalletAssets({
  sub_wallet_id: wallet.sub_wallet_id,
  symbol: "ETH",
});

console.log("余额:", assets.balance);
```

#### 5. 发起提现

```javascript
const withdrawal = await mpcClient.getWithdrawApi().withdraw({
  request_id: `withdraw_${Date.now()}`, // 唯一请求 ID
  sub_wallet_id: wallet.sub_wallet_id,
  symbol: "ETH",
  address_to: "0x...", // 目标地址
  amount: "0.01", // 提现金额
});

console.log("提现 ID:", withdrawal.withdraw_id);
```

#### 6. 查询充值记录

```javascript
const deposits = await mpcClient.getDepositApi().syncDepositRecords({
  max_id: 0, // 起始 ID，0 表示从最新开始
});

console.log("充值记录:", deposits);
```

### WaaS API 快速开始

#### 1. 配置

```javascript
const Cons = require("@chainup-custody/js-waas-sdk/utils/Constants");

Cons.setAppId("your_app_id");
Cons.setHost("https://openapi.chainup.com");
Cons.setPubKey("your_chainup_public_key");
Cons.setPrivateKey("your_merchant_private_key");
```

#### 2. 注册用户

```javascript
const userApi = require("@chainup-custody/js-waas-sdk/apidao/userApiDao");

const user = await userApi.registerByEmail({
  email: "user@example.com",
});

console.log("用户 ID:", user.uid);
```

#### 3. 获取充值地址

```javascript
const accountApi = require("@chainup-custody/js-waas-sdk/apidao/AccountApiDao");

const address = await accountApi.getDepositAddress({
  symbol: "ETH",
  uid: user.uid,
});

console.log("充值地址:", address.address);
```

#### 4. 提现

```javascript
const billingApi = require("@chainup-custody/js-waas-sdk/apidao/BillingApiDao");

const result = await billingApi.withdraw({
  request_id: `withdraw_${Date.now()}`,
  from_uid: user.uid,
  to_address: "0x...",
  amount: "0.01",
  symbol: "ETH",
});

console.log("提现结果:", result);
```

## 常见场景

### 场景 1: 获取支持的币种

```javascript
// MPC API
const chains = await mpcClient.getWorkSpaceApi().getSupportMainChain();
console.log("支持的主链:", chains);

const coins = await mpcClient.getWorkSpaceApi().getCoinDetails({
  open_chain: true, // 只获取已开通的
  limit: 100,
});
console.log("币种详情:", coins);
```

### 场景 2: 批量查询地址

```javascript
const addresses = await mpcClient.getWalletApi().queryWalletAddress({
  sub_wallet_id: 123456,
  symbol: "ETH",
  max_id: 0,
});

addresses.forEach((addr) => {
  console.log(`地址: ${addr.address}, 余额: ${addr.balance}`);
});
```

### 场景 3: 查询交易记录

```javascript
// 查询提现记录
const withdrawals = await mpcClient.getWithdrawApi().getWithdrawRecords({
  ids: "request_id1,request_id2,request_id3",
});

// 同步所有提现记录
const allWithdrawals = await mpcClient.getWithdrawApi().syncWithdrawRecords({
  max_id: 0,
});
```

### 场景 4: Web3 交易

```javascript
// 创建 Web3 交易
const web3Tx = await mpcClient.getWeb3Api().createWeb3Trans({
  request_id: `web3_${Date.now()}`,
  sub_wallet_id: 123456,
  symbol: "ETH",
  from_addr: "0x...",
  to_addr: "0x...",
  amount: "0",
  input_data: "0x...", // 合约调用数据
});

// 加速交易（如果 gas 费不够）
if (web3Tx.status === "pending") {
  await mpcClient.getWeb3Api().accelerationWeb3Trans({
    sub_wallet_id: 123456,
    request_id: web3Tx.request_id,
    fee: "0.001", // 新的矿工费
  });
}
```

### 场景 5: 自动归集

```javascript
// 配置自动归集
await mpcClient.getAutoSweepApi().setAutoCollectSymbol({
  symbol: "USDTERC20",
  collect_min: "100", // 最小归集金额
  fueling_limit: "0.01", // 最大加油费
});

// 查询归集记录
const sweepRecords = await mpcClient.getAutoSweepApi().syncAutoCollectRecords({
  max_id: 0,
});
```

### 场景 6: 处理异步通知

```javascript
// 假设这是从 webhook 接收到的加密数据
const encryptedNotification = req.body.data;

// 解密通知
const notifyApi = mpcClient.getNotifyApi();
const notification = notifyApi.decodeNotifyRequest(encryptedNotification);

console.log("通知类型:", notification.notify_type);
console.log("交易信息:", notification);

// 处理充值通知
if (notification.notify_type === "deposit") {
  // 更新用户余额
  await updateUserBalance(notification.uid, notification.amount);
}

// 处理提现通知
if (notification.notify_type === "withdraw") {
  // 更新提现状态
  await updateWithdrawStatus(notification.request_id, notification.status);
}
```

## 错误处理

```javascript
try {
  const result = await mpcClient.getWalletApi().createWallet({
    sub_wallet_name: "Test Wallet",
  });
  console.log("成功:", result);
} catch (error) {
  console.error("错误:", error.message);

  // 根据错误类型处理
  if (error.code === "INVALID_PARAMS") {
    console.log("参数错误");
  } else if (error.code === "NETWORK_ERROR") {
    console.log("网络错误，请重试");
  } else {
    console.log("未知错误");
  }
}
```

## 环境配置

### 开发环境

```javascript
const config = {
  appId: process.env.CHAINUP_APP_ID,
  privateKey: process.env.CHAINUP_PRIVATE_KEY,
  publicKey: process.env.CHAINUP_PUBLIC_KEY,
  host: "https://testapi.chainup.com", // 测试环境
  debug: true,
};
```

### 生产环境

```javascript
const config = {
  appId: process.env.CHAINUP_APP_ID,
  privateKey: process.env.CHAINUP_PRIVATE_KEY,
  publicKey: process.env.CHAINUP_PUBLIC_KEY,
  host: "https://openapi.chainup.com", // 生产环境
  debug: false,
};
```

## 注意事项

1. **密钥安全**
   - 不要在代码中硬编码密钥
   - 使用环境变量或配置文件
   - 定期更换密钥

2. **request_id 唯一性**
   - 每次提现/转账必须使用唯一的 request_id
   - 建议使用时间戳 + 随机数
   - 可以用于防止重复提交

3. **金额精度**
   - 使用字符串类型表示金额
   - 避免浮点数精度问题
   - 注意币种的小数位数

4. **错误重试**
   - 网络错误建议重试
   - 业务错误不要重试
   - 实现指数退避策略

5. **异步通知**
   - 必须验证签名
   - 处理要幂等
   - 及时返回响应

## 完整示例

参见 [examples/mpc-examples.js](../examples/mpc-examples.js) 文件，包含所有 API 的使用示例。

## 获取帮助

- 查看 [完整文档](../README.md)
- 访问 [官方文档](https://custodydocs-en.chainup.com/)
- 提交 [GitHub Issue](https://github.com/HiCoinCom/js-sdk/issues)
- 联系技术支持: custody@chainup.com

---

**祝你使用愉快！** 🚀
