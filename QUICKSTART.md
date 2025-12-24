# ChainUp Custody JS SDK - 快速开始指南

## 🚀 5分钟快速上手

### 第1步: 安装

```bash
npm install @chainup-custody/js-waas-sdk
```

### 第2步: 配置环境变量

创建 `.env` 文件：

```bash
# WaaS 配置
WAAS_HOST=https://api.custody.chainup.com
WAAS_APP_ID=your-app-id
WAAS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
...your private key...
-----END PRIVATE KEY-----"
WAAS_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
...chainup public key...
-----END PUBLIC KEY-----"

# MPC 配置（可选）
MPC_DOMAIN=https://mpc-api.custody.chainup.com
MPC_APP_ID=your-mpc-app-id
MPC_API_KEY=your-api-key
MPC_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
...your mpc private key...
-----END PRIVATE KEY-----"
```

### 第3步: 初始化客户端

#### WaaS 客户端

```javascript
const { WaasClient } = require("@chainup-custody/js-waas-sdk");

// 创建客户端
const client = WaasClient.newBuilder()
  .setHost(process.env.WAAS_HOST)
  .setAppId(process.env.WAAS_APP_ID)
  .setPrivateKey(process.env.WAAS_PRIVATE_KEY)
  .setPublicKey(process.env.WAAS_PUBLIC_KEY)
  .setDebug(true) // 开发环境启用调试
  .build();
```

#### MPC 客户端（可选）

```javascript
const { MpcClient } = require("@chainup-custody/js-waas-sdk");

// 创建 MPC 客户端
const mpcClient = MpcClient.newBuilder()
  .setAppId(process.env.MPC_APP_ID)
  .setRsaPrivateKey(process.env.MPC_PRIVATE_KEY)
  .setApiKey(process.env.MPC_API_KEY)
  .setDomain(process.env.MPC_DOMAIN)
  .build();
```

### 第4步: 开始使用

#### 示例1: 注册用户

```javascript
async function registerUser() {
  const userApi = client.getUserApi();

  try {
    const user = await userApi.registerByEmail({
      email: "user@example.com",
    });

    console.log("用户注册成功:", user);
    return user;
  } catch (error) {
    console.error("注册失败:", error.message);
  }
}

registerUser();
```

#### 示例2: 获取账户余额

```javascript
async function getBalance(userId) {
  const accountApi = client.getAccountApi();

  try {
    const balance = await accountApi.getBalance({
      userId: userId,
      coinType: "BTC",
    });

    console.log("BTC 余额:", balance);
    return balance;
  } catch (error) {
    console.error("获取余额失败:", error.message);
  }
}

getBalance("user-id-123");
```

#### 示例3: 内部转账

```javascript
async function transfer() {
  const transferApi = client.getTransferApi();

  try {
    const result = await transferApi.transfer({
      fromUserId: "user1",
      toUserId: "user2",
      coinType: "USDT",
      amount: "100",
      requestId: `transfer_${Date.now()}`,
    });

    console.log("转账成功:", result);
    return result;
  } catch (error) {
    console.error("转账失败:", error.message);
  }
}

transfer();
```

#### 示例4: 提现

```javascript
async function withdraw() {
  const transferApi = client.getTransferApi();

  try {
    const result = await transferApi.withdraw({
      userId: "user123",
      coinType: "ETH",
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      amount: "0.1",
      requestId: `withdraw_${Date.now()}`,
    });

    console.log("提现已提交:", result);
    return result;
  } catch (error) {
    console.error("提现失败:", error.message);
  }
}

withdraw();
```

### 第5步: 处理 Webhook 通知

```javascript
const express = require("express");
const app = express();

app.use(express.json());

// 充值通知
app.post("/webhook/deposit", (req, res) => {
  const asyncNotifyApi = client.getAsyncNotifyApi();
  const signature = req.headers["x-signature"];
  const notifyData = req.body;

  // 验证签名
  if (!asyncNotifyApi.verifyNotifySignature(notifyData, signature)) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  // 处理充值
  const depositInfo = asyncNotifyApi.processDepositNotify(notifyData);
  console.log("收到充值:", depositInfo);

  // 业务逻辑...

  // 返回成功
  res.json(asyncNotifyApi.createNotifyResponse(true));
});

app.listen(3000, () => {
  console.log("Webhook 服务器运行在端口 3000");
});
```

## 📚 更多资源

- [完整示例](./examples/) - 更多使用示例
- [API 文档](./README.md) - 完整的 API 参考
- [英文文档](./README_EN.md) - English Documentation
- [重构总结](./REFACTORING_SUMMARY.md) - 架构说明

## 🔍 常见问题

### Q1: 如何获取 API 密钥？

A: 登录 ChainUp Custody 管理后台获取 App ID 和密钥。

### Q2: 如何启用调试模式？

A: 在 Builder 中调用 `.setDebug(true)`。

### Q3: 如何处理错误？

A: 使用 try-catch 捕获错误：

```javascript
try {
  const result = await api.someMethod();
} catch (error) {
  console.error("Error:", error.message);
}
```

### Q4: 旧版本 API 还能用吗？

A: 可以，但推荐迁移到新版本。参考迁移指南。

### Q5: 支持 TypeScript 吗？

A: 通过 JSDoc 提供类型提示，可以在 TypeScript 项目中使用。

## 💡 最佳实践

1. ✅ **使用环境变量** - 不要硬编码密钥
2. ✅ **启用调试模式** - 开发环境中启用
3. ✅ **错误处理** - 始终使用 try-catch
4. ✅ **请求ID** - 使用唯一的 requestId 保证幂等性
5. ✅ **签名验证** - Webhook 必须验证签名

## 🎯 下一步

1. 查看 [完整示例](./examples/)
2. 阅读 [API 文档](./README.md)
3. 集成到你的项目
4. 开始开发！

---

**遇到问题？**

- 查看 [GitHub Issues](https://github.com/HiCoinCom/js-sdk/issues)
- 联系技术支持: custody@chainup.com

祝你使用愉快！🎉
