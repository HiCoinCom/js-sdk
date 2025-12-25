# MPC 提现签名功能

## 概述

MPC 提现和 Web3 交易支持可选的 RSA 签名功能，用于增强安全性。签名使用额外的 RSA 私钥对交易参数进行签名。

## 配置

在创建 MPC 客户端时，可以选择性地配置 `signPrivateKey`：

```javascript
const { MpcClient } = require("@chainup-custody/js-waas-sdk");

const mpcClient = MpcClient.newBuilder()
  .setAppId("your-app-id")
  .setRsaPrivateKey("-----BEGIN PRIVATE KEY-----\n...")
  .setApiKey("your-api-key")
  .setDomain("https://mpc-api.custody.chainup.com")
  .setSignPrivateKey("-----BEGIN PRIVATE KEY-----\n...") // 可选：用于交易签名
  .build();
```

## 提现签名

### 基本用法

```javascript
const withdrawApi = mpcClient.getWithdrawApi();

// 方式 1：不使用签名（默认）
const result1 = await withdrawApi.withdraw({
  requestId: "unique-request-id",
  subWalletId: 123,
  symbol: "ETH",
  amount: "0.1",
  addressTo: "0x123...",
});

// 方式 2：使用签名
const result2 = await withdrawApi.withdraw({
  requestId: "unique-request-id",
  subWalletId: 123,
  symbol: "ETH",
  amount: "0.1",
  addressTo: "0x123...",
  needTransactionSign: true, // 启用签名
});
```

### 签名参数

参与签名的参数：

- `request_id` - 请求ID
- `sub_wallet_id` - 子钱包ID
- `symbol` - 币种符号
- `address_to` - 目标地址
- `amount` - 提现金额
- `memo` - 地址备注（可选）
- `outputs` - UTXO 输出（可选，用于 BTC 类币种）

### 签名规则

1. **参数拼接**：按照 `k1=v1&k2=v2` 格式拼接
2. **ASCII 排序**：参数键按照 ASCII 升序排序
3. **跳过空值**：空值参数不参与签名
4. **数字处理**：数字不得以 0 结尾（如 `1.0001000` 需使用 `1.0001`）
5. **转小写**：拼接后的字符串转为小写
6. **MD5 加密**：对拼接字符串进行 MD5 加密
7. **RSA 签名**：使用 SHA256 算法对 MD5 值进行 RSA 签名
8. **Base64 编码**：对签名结果进行 Base64 编码

### 示例

```javascript
// 示例参数
const params = {
  request_id: "test-123",
  sub_wallet_id: "1001",
  symbol: "HECO",
  address_to: "0xcF88c8a960d5e155A9F3236a9f4e7CacE29E5050",
  amount: "0.00000100000", // 会被处理为 0.000001
  memo: "",
};

// 签名过程
// 1. 排序并拼接：address_to=0xcf88c8a960d5e155a9f3236a9f4e7cace29e5050&amount=0.000001&request_id=test-123&sub_wallet_id=1001&symbol=heco
// 2. MD5：c10c47a46b616526e739985ce1c7f15d
// 3. RSA-SHA256 签名
// 4. Base64 编码
```

## Web3 交易签名

Web3 交易也支持相同的签名机制：

```javascript
const web3Api = mpcClient.getWeb3Api();

const result = await web3Api.createWeb3Trans({
  requestId: "unique-request-id",
  subWalletId: 123,
  mainChainSymbol: "ETH",
  interactiveContract: "0xcontract...",
  amount: "0.1",
  inputData: "0x...",
  needTransactionSign: true, // 启用签名
});
```

### Web3 签名参数

参与签名的参数：

- `request_id` - 请求ID
- `sub_wallet_id` - 子钱包ID
- `main_chain_symbol` - 主链符号
- `interactive_contract` - 交互合约地址
- `amount` - 交易金额
- `input_data` - 输入数据

## 错误处理

```javascript
try {
  const result = await withdrawApi.withdraw({
    requestId: "test-123",
    subWalletId: 123,
    symbol: "ETH",
    amount: "0.1",
    addressTo: "0x123...",
    needTransactionSign: true,
  });
} catch (error) {
  if (error.message.includes("signPrivateKey")) {
    console.error("签名私钥未配置");
  } else {
    console.error("提现失败:", error.message);
  }
}
```

## 安全建议

1. **私钥管理**：
   - `signPrivateKey` 应与 API 通信用的 `rsaPrivateKey` 分开管理
   - 使用环境变量或密钥管理系统存储
   - 不要将私钥硬编码在代码中

2. **使用场景**：
   - 高价值交易建议启用签名
   - 内部测试环境可以不启用签名
   - 生产环境建议配置签名私钥，但可按需启用

3. **密钥轮换**：
   - 定期更换签名私钥
   - 更换时需要在 ChainUp Custody 后台同步更新公钥

## API 参考

### MpcClient.Builder

```javascript
setSignPrivateKey(signPrivateKey: string): Builder
```

设置用于交易签名的 RSA 私钥（可选）。

**参数：**

- `signPrivateKey` - PEM 格式的 RSA 私钥

**返回：**

- Builder 实例，支持链式调用

### WithdrawApi.withdraw()

```javascript
withdraw(params: Object): Promise<Object>
```

**参数：**

- `params.requestId` - 唯一请求ID（必需）
- `params.subWalletId` - 子钱包ID（必需）
- `params.symbol` - 币种符号（必需）
- `params.amount` - 提现金额（必需）
- `params.addressTo` - 目标地址（必需）
- `params.memo` - 地址备注（可选）
- `params.remark` - 提现备注（可选）
- `params.outputs` - UTXO 输出（可选）
- `params.needTransactionSign` - 是否签名（可选，默认 false）

**返回：**

- Promise<Object> - 提现结果

### MpcSignUtil

工具类，提供签名相关方法：

```javascript
const MpcSignUtil = require("@chainup-custody/js-waas-sdk/utils/MpcSignUtil");

// 生成提现签名
const sign = MpcSignUtil.generateWithdrawSign(params, signPrivateKey);

// 生成 Web3 签名
const sign = MpcSignUtil.generateWeb3Sign(params, signPrivateKey);

// 参数排序
const sorted = MpcSignUtil.paramsSort(params);

// MD5 哈希
const hash = MpcSignUtil.md5(data);
```

## 测试

运行签名相关测试：

```bash
npm test -- test/mpc-sign-util.test.js
```

## 参考

- [ChainUp Custody MPC API 文档](https://custodydocs-en.chainup.com/api-references/mpc-apis/apis/withdraw/withdraw)
- [签名验证规则](https://custodydocs-en.chainup.com/api-references/mpc-apis/co-signer/sign-verify)
