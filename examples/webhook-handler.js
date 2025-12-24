/**
 * Webhook Handler Example
 * Demonstrates handling asynchronous notifications from ChainUp Custody
 */

const express = require('express');
const { WaasClient, MpcClient } = require('../index');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============== WaaS Client Setup ==============
const waasClient = WaasClient.newBuilder()
  .setHost(process.env.WAAS_HOST)
  .setAppId(process.env.WAAS_APP_ID)
  .setPrivateKey(process.env.WAAS_PRIVATE_KEY)
  .setPublicKey(process.env.WAAS_PUBLIC_KEY)
  .setDebug(true)
  .build();

const asyncNotifyApi = waasClient.getAsyncNotifyApi();

// ============== MPC Client Setup ==============
const mpcClient = MpcClient.newBuilder()
  .setAppId(process.env.MPC_APP_ID)
  .setRsaPrivateKey(process.env.MPC_PRIVATE_KEY)
  .setApiKey(process.env.MPC_API_KEY)
  .setDomain(process.env.MPC_DOMAIN)
  .build();

const mpcNotifyApi = mpcClient.getNotifyApi();

// ============== WaaS Webhook Handlers ==============

/**
 * Handle WaaS deposit notifications
 */
app.post('/webhook/waas/deposit', async (req, res) => {
  console.log('\n=== WaaS Deposit Notification Received ===');
  
  try {
    const signature = req.headers['x-signature'];
    const notifyData = req.body;
    
    // Verify signature
    if (!asyncNotifyApi.verifyNotifySignature(notifyData, signature)) {
      console.error('Invalid signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    // Process deposit notification
    const depositInfo = asyncNotifyApi.processDepositNotify(notifyData);
    console.log('Deposit Info:', depositInfo);
    
    // Your business logic here
    await handleDeposit(depositInfo);
    
    // Return success response
    res.json(asyncNotifyApi.createNotifyResponse(true));
  } catch (error) {
    console.error('Deposit notification processing failed:', error);
    res.status(500).json(asyncNotifyApi.createNotifyResponse(false, error.message));
  }
});

/**
 * Handle WaaS withdrawal notifications
 */
app.post('/webhook/waas/withdraw', async (req, res) => {
  console.log('\n=== WaaS Withdrawal Notification Received ===');
  
  try {
    const signature = req.headers['x-signature'];
    const notifyData = req.body;
    
    // Verify signature
    if (!asyncNotifyApi.verifyNotifySignature(notifyData, signature)) {
      console.error('Invalid signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    // Process withdrawal notification
    const withdrawInfo = asyncNotifyApi.processWithdrawNotify(notifyData);
    console.log('Withdrawal Info:', withdrawInfo);
    
    // Your business logic here
    await handleWithdrawal(withdrawInfo);
    
    // Return success response
    res.json(asyncNotifyApi.createNotifyResponse(true));
  } catch (error) {
    console.error('Withdrawal notification processing failed:', error);
    res.status(500).json(asyncNotifyApi.createNotifyResponse(false, error.message));
  }
});

/**
 * Handle WaaS internal transfer notifications
 */
app.post('/webhook/waas/transfer', async (req, res) => {
  console.log('\n=== WaaS Transfer Notification Received ===');
  
  try {
    const signature = req.headers['x-signature'];
    const notifyData = req.body;
    
    // Verify signature
    if (!asyncNotifyApi.verifyNotifySignature(notifyData, signature)) {
      console.error('Invalid signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    // Process transfer notification
    const transferInfo = asyncNotifyApi.processTransferNotify(notifyData);
    console.log('Transfer Info:', transferInfo);
    
    // Your business logic here
    await handleTransfer(transferInfo);
    
    // Return success response
    res.json(asyncNotifyApi.createNotifyResponse(true));
  } catch (error) {
    console.error('Transfer notification processing failed:', error);
    res.status(500).json(asyncNotifyApi.createNotifyResponse(false, error.message));
  }
});

// ============== MPC Webhook Handlers ==============

/**
 * Handle MPC deposit notifications
 */
app.post('/webhook/mpc/deposit', async (req, res) => {
  console.log('\n=== MPC Deposit Notification Received ===');
  
  try {
    const signature = req.headers['x-signature'];
    const notifyData = req.body;
    
    // Verify signature
    if (!mpcNotifyApi.verifyNotifySignature(notifyData, signature)) {
      console.error('Invalid signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    console.log('MPC Deposit Info:', notifyData);
    
    // Your business logic here
    await handleMpcDeposit(notifyData);
    
    // Return success response
    res.json({ code: 0, message: 'OK' });
  } catch (error) {
    console.error('MPC deposit notification processing failed:', error);
    res.status(500).json({ code: -1, message: error.message });
  }
});

/**
 * Handle MPC withdrawal notifications
 */
app.post('/webhook/mpc/withdraw', async (req, res) => {
  console.log('\n=== MPC Withdrawal Notification Received ===');
  
  try {
    const signature = req.headers['x-signature'];
    const notifyData = req.body;
    
    // Verify signature
    if (!mpcNotifyApi.verifyNotifySignature(notifyData, signature)) {
      console.error('Invalid signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    console.log('MPC Withdrawal Info:', notifyData);
    
    // Your business logic here
    await handleMpcWithdrawal(notifyData);
    
    // Return success response
    res.json({ code: 0, message: 'OK' });
  } catch (error) {
    console.error('MPC withdrawal notification processing failed:', error);
    res.status(500).json({ code: -1, message: error.message });
  }
});

// ============== Business Logic Functions ==============

/**
 * Handle deposit business logic
 */
async function handleDeposit(depositInfo) {
  console.log('Processing deposit:', depositInfo);
  
  // Example: Update database, credit user account, etc.
  // await db.deposits.create({
  //   userId: depositInfo.userId,
  //   coinType: depositInfo.coinType,
  //   amount: depositInfo.amount,
  //   txid: depositInfo.txid,
  //   confirmations: depositInfo.confirmations,
  //   status: depositInfo.confirmations >= 6 ? 'confirmed' : 'pending'
  // });
  
  console.log('Deposit processed successfully');
}

/**
 * Handle withdrawal business logic
 */
async function handleWithdrawal(withdrawInfo) {
  console.log('Processing withdrawal:', withdrawInfo);
  
  // Example: Update withdrawal status in database
  // await db.withdrawals.update({
  //   where: { userId: withdrawInfo.userId, txid: withdrawInfo.txid },
  //   data: { status: withdrawInfo.status }
  // });
  
  console.log('Withdrawal processed successfully');
}

/**
 * Handle internal transfer business logic
 */
async function handleTransfer(transferInfo) {
  console.log('Processing transfer:', transferInfo);
  
  // Example: Update balances
  // await db.balances.decrement({
  //   where: { userId: transferInfo.fromUserId },
  //   amount: transferInfo.amount
  // });
  // await db.balances.increment({
  //   where: { userId: transferInfo.toUserId },
  //   amount: transferInfo.amount
  // });
  
  console.log('Transfer processed successfully');
}

/**
 * Handle MPC deposit business logic
 */
async function handleMpcDeposit(depositData) {
  console.log('Processing MPC deposit:', depositData);
  
  // Your MPC deposit handling logic
  
  console.log('MPC deposit processed successfully');
}

/**
 * Handle MPC withdrawal business logic
 */
async function handleMpcWithdrawal(withdrawData) {
  console.log('Processing MPC withdrawal:', withdrawData);
  
  // Your MPC withdrawal handling logic
  
  console.log('MPC withdrawal processed successfully');
}

// ============== Health Check ==============

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============== Start Server ==============

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════════════╗
  ║  ChainUp Custody Webhook Server                   ║
  ║  Port: ${PORT}                                      ║
  ║                                                    ║
  ║  Endpoints:                                        ║
  ║  - POST /webhook/waas/deposit                     ║
  ║  - POST /webhook/waas/withdraw                    ║
  ║  - POST /webhook/waas/transfer                    ║
  ║  - POST /webhook/mpc/deposit                      ║
  ║  - POST /webhook/mpc/withdraw                     ║
  ║  - GET  /health                                   ║
  ╚════════════════════════════════════════════════════╝
  `);
});

// ============== Error Handlers ==============

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

module.exports = app;
