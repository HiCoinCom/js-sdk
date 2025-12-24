#!/usr/bin/env node

/**
 * Script to update all MPC API JSDoc to use snake_case parameter names
 * and add detailed type definitions
 */

const fs = require('fs');
const path = require('path');

// Pattern to replace camelCase with snake_case in JSDoc
const replacements = {
  // Common parameter replacements
  'params.requestId': 'params.request_id',
  'params.subWalletId': 'params.sub_wallet_id', 
  'params.walletName': 'params.sub_wallet_name',
  'params.walletId': 'params.sub_wallet_id',
  'params.showStatus': 'params.app_show_status',
  'params.addressTo': 'params.address_to',
  'params.addressFrom': 'params.address_from',
  'params.requestIds': 'params.request_ids',
  'params.maxId': 'params.max_id',
  'params.pageSize': 'params.page_size',
  'params.chainId': 'params.chain_id',
  'params.fromAddr': 'params.from_addr',
  'params.toAddr': 'params.to_addr',
  'params.gasPrice': 'params.gas_price',
  'params.gasLimit': 'params.gas_limit',
  'params.mainChainSymbol': 'params.main_chain_symbol',
  'params.contractAddress': 'params.contract_address',
  'params.inputData': 'params.input_data',
  'params.autoCollectStatus': 'params.auto_collect_status',
  'params.subWalletIds': 'params.sub_wallet_ids',
  'params.receiverAddress': 'params.receiver_address',
  'params.coinType': 'params.symbol',
  'params.baseSymbol': 'params.base_symbol',
  'params.openChain': 'params.open_chain',
  'params.needTransactionSign': 'params.need_transaction_sign',
};

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Replace in JSDoc comments only (between /** and */)
  content = content.replace(/\/\*\*[\s\S]*?\*\//g, (match) => {
    let updated = match;
    for (const [old, newVal] of Object.entries(replacements)) {
      if (updated.includes(old)) {
        updated = updated.replace(new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newVal);
        modified = true;
      }
    }
    return updated;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${path.basename(filePath)}`);
    return true;
  }
  
  return false;
}

// Update all MPC API files
const apiDir = path.join(__dirname, '../mpc/api');
const files = fs.readdirSync(apiDir).filter(f => f.endsWith('.js') && f !== 'MpcBaseApi.js');

console.log('🔄 Updating MPC API JSDoc comments to use snake_case parameters...\n');

let updatedCount = 0;
files.forEach(file => {
  const filePath = path.join(apiDir, file);
  if (updateFile(filePath)) {
    updatedCount++;
  }
});

console.log(`\n✨ Complete! Updated ${updatedCount} files.`);
