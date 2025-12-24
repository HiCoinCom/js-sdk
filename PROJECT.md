# ChainUp Custody JS SDK - Project Documentation

## 项目概述

**项目名称**: @chainup-custody/js-waas-sdk  
**版本**: 2.0.0  
**描述**: ChainUp Custody SDK for Node.js - 支持 WaaS 和 MPC API  
**官网**: https://waas.chainup.com/  
**仓库**: https://github.com/HiCoinCom/js-sdk  
**许可证**: MIT

## 项目简介

ChainUp Custody JavaScript SDK 是一个用于与 ChainUp 托管服务交互的 Node.js 客户端库。该 SDK 提供了两种主要的服务类型：

1. **WaaS (Wallet as a Service)**: 传统托管钱包服务
2. **MPC (Multi-Party Computation)**: 多方计算钱包服务

## 核心功能

### WaaS API

- 用户管理（注册、查询）
- 账户管理（余额、地址）
- 充值提现
- 内部转账
- 异步通知处理

### MPC API

- 工作空间管理
- 钱包创建和管理
- 充值管理
- 提现管理
- Web3 交易
- 自动归集
- Tron 资源购买
- 通知处理

## 技术栈

### 核心依赖

| 依赖           | 版本    | 用途                   |
| -------------- | ------- | ---------------------- |
| node-rsa       | ^1.1.1  | RSA 加密解密           |
| request        | ^2.88.2 | HTTP 客户端            |
| urlsafe-base64 | ^1.0.0  | URL 安全的 Base64 编码 |

### 运行环境

- Node.js >= 12.0.0
- npm or yarn

## 项目架构

### 目录结构

```
js-sdk/
├── apidao/                      # API DAO 层
│   ├── AccountApiDao.js         # WaaS 账户 API
│   ├── AsyncNotifyApiDao.js     # WaaS 异步通知 API
│   ├── BillingApiDao.js         # WaaS 充值提现 API
│   ├── TransferApiDao.js        # WaaS 转账 API
│   ├── userApiDao.js            # WaaS 用户 API
│   └── mpc/                     # MPC API 模块
│       ├── WorkSpaceApiDao.js   # 工作空间 API
│       ├── WalletApiDao.js      # 钱包 API
│       ├── DepositApiDao.js     # 充值 API
│       ├── WithdrawApiDao.js    # 提现 API
│       ├── Web3ApiDao.js        # Web3 API
│       ├── AutoSweepApiDao.js   # 自动归集 API
│       ├── NotifyApiDao.js      # 通知 API
│       └── TronResourceApiDao.js # Tron 资源 API
│
├── utils/                       # 工具类
│   ├── Constants.js             # WaaS 常量配置
│   ├── MpcConstants.js          # MPC 常量配置
│   ├── RSAUtil.js               # RSA 加密工具
│   ├── WASSHttpUtils.js         # WaaS HTTP 工具
│   └── MpcHttpUtils.js          # MPC HTTP 工具
│
├── examples/                    # 示例代码
│   └── mpc-examples.js          # MPC 使用示例
│
├── MpcClient.js                 # MPC 客户端工厂
├── package.json                 # 项目配置
├── README.md                    # 使用文档
├── CHANGELOG.md                 # 更新日志
└── LICENSE                      # MIT 许可证
```

### 模块说明

#### API DAO 层

负责直接调用 ChainUp API，处理请求和响应。

#### 工具类层

- **RSAUtil**: RSA 加密解密
- **HttpUtils**: HTTP 请求封装
- **Constants**: 配置常量管理

#### 客户端层

- **MpcClient**: MPC API 统一入口
- **MpcClientFactory**: 客户端工厂，负责配置和创建

## 设计模式

### 1. 工厂模式

**类**: `MpcClientFactory`

用于创建和配置 MPC 客户端实例。

```javascript
const mpcClient = MpcClientFactory.createClient({
  appId: "your_app_id",
  privateKey: "your_private_key",
  publicKey: "your_public_key",
  host: "https://openapi.chainup.com",
});
```

### 2. 模块化设计

每个 API 模块独立封装，职责单一，易于维护和扩展。

### 3. 门面模式

**类**: `MpcClient`

提供统一的高层接口，简化 API 调用。

```javascript
mpcClient.getWalletApi().createWallet({...});
mpcClient.getWithdrawApi().withdraw({...});
```

## 安全机制

### 1. RSA 加密

- 请求参数使用商户私钥加密
- 响应数据使用 ChainUp 公钥解密
- 确保数据传输安全

### 2. 签名验证

- 每个请求包含 app_id 和 timestamp
- 支持交易签名验证

### 3. HTTPS 通信

所有 API 调用必须使用 HTTPS 协议。

## API 分类

### WaaS API

#### 用户管理 (userApiDao)

- 手机号注册
- 邮箱注册
- 查询用户信息
- 获取币种列表

#### 账户管理 (AccountApiDao)

- 查询用户账户余额
- 查询用户充值地址
- 查询商户收款账户

#### 充值提现 (BillingApiDao)

- 发起提现
- 查询提现记录
- 同步提现记录
- 查询充值记录
- 同步充值记录
- 查询矿工费记录

#### 转账 (TransferApiDao)

- 内部转账
- 查询转账记录
- 同步转账记录

#### 异步通知 (AsyncNotifyApiDao)

- 解密充值通知
- 解密提现验证
- 加密提现响应

### MPC API

#### 工作空间 (WorkSpaceApiDao)

- 获取支持的主链
- 获取币种详情
- 获取最新区块高度

#### 钱包管理 (WalletApiDao)

- 创建钱包
- 创建钱包地址
- 查询钱包地址
- 获取钱包资产
- 修改显示状态
- 验证地址信息

#### 充值管理 (DepositApiDao)

- 获取充值记录
- 同步充值记录

#### 提现管理 (WithdrawApiDao)

- 发起提现
- 查询提现记录
- 同步提现记录

#### Web3 交易 (Web3ApiDao)

- 创建 Web3 交易
- 加速 Web3 交易
- 查询 Web3 记录
- 同步 Web3 记录

#### 自动归集 (AutoSweepApiDao)

- 获取归集钱包
- 配置自动归集
- 同步归集记录

#### Tron 资源 (TronResourceApiDao)

- 购买 Tron 资源
- 查询购买记录

#### 通知处理 (NotifyApiDao)

- 解密通知请求
- 处理提现验证

## 使用流程

### WaaS API 使用流程

1. 配置认证信息

```javascript
const Cons = require("./utils/Constants");
Cons.setAppId("your_app_id");
Cons.setHost("https://openapi.chainup.com");
Cons.setPubKey("your_chainup_public_key");
Cons.setPrivateKey("your_merchant_private_key");
```

2. 调用 API

```javascript
const userApi = require("./apidao/userApiDao");
const result = await userApi.registerByEmail({ email: "user@example.com" });
```

### MPC API 使用流程

1. 创建客户端

```javascript
const { MpcClientFactory } = require("./MpcClient");
const mpcClient = MpcClientFactory.createClient({
  appId: "your_app_id",
  privateKey: "your_private_key",
  publicKey: "your_public_key",
  host: "https://openapi.chainup.com",
});
```

2. 调用 API

```javascript
const wallet = await mpcClient.getWalletApi().createWallet({
  sub_wallet_name: "My Wallet",
  app_show_status: 1,
});
```

## 数据流程

```
客户端应用
    ↓
MpcClient / WaaS API
    ↓
ApiDao (数据封装)
    ↓
HttpUtils (HTTP 请求)
    ↓
RSAUtil (加密/解密)
    ↓
ChainUp API 服务端
```

## 错误处理

### 错误类型

1. **配置错误**: 缺少必要的配置参数
2. **加密错误**: RSA 加密/解密失败
3. **网络错误**: HTTP 请求失败
4. **业务错误**: API 返回错误码

### 错误处理示例

```javascript
try {
    const result = await mpcClient.getWalletApi().createWallet({...});
    console.log('Success:', result);
} catch (error) {
    console.error('Error:', error.message);
    // 处理错误
}
```

## 最佳实践

### 1. 密钥管理

- 不要在代码中硬编码密钥
- 使用环境变量或配置文件
- 定期更换密钥

### 2. 错误处理

- 始终使用 try-catch 捕获异常
- 记录详细的错误日志
- 实现重试机制

### 3. 性能优化

- 复用客户端实例
- 合理使用缓存
- 批量处理请求

### 4. 安全建议

- 使用 HTTPS 协议
- 验证所有输入参数
- 实现请求限流
- 定期审计日志

## 版本历史

- **2.0.0** (2025-12-24):
  - 新增完整 MPC API 支持
  - 添加 MpcClient 工厂模式
  - 完善文档和示例
- **1.0.6**:
  - 初始 WaaS API 支持

## 支持与联系

- **官方网站**: https://waas.chainup.com/
- **API 文档**: https://custodydocs-en.chainup.com/
- **GitHub**: https://github.com/HiCoinCom/js-sdk
- **邮箱**: admin@chainup.com

## 许可证

MIT License

Copyright © ChainUp Custody

---

**最后更新**: 2025年12月24日  
**维护者**: ChainUp Custody Team
