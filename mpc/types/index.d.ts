/**
 * ChainUp Custody MPC API TypeScript Definitions
 * @version 2.1.0
 */

declare module '@chainup-custody/js-waas-sdk' {
  // ============================================================================
  // MPC Configuration Types
  // ============================================================================

  export interface MpcConfigOptions {
    appId: string;
    rsaPrivateKey: string;
    apiKey: string;
    domain: string;
    signPrivateKey?: string;
    debug?: boolean;
  }

  export class MpcConfig {
    constructor(options: MpcConfigOptions);
    appId: string;
    rsaPrivateKey: string;
    apiKey: string;
    domain: string;
    signPrivateKey?: string;
    debug: boolean;
  }

  // ============================================================================
  // Common Types
  // ============================================================================

  export interface ApiResponse<T = any> {
    code: string;
    msg: string;
    data: T;
  }

  export interface PaginationParams {
    page?: number;
    page_size?: number;
  }

  export interface SyncParams {
    max_id?: number;
  }

  // ============================================================================
  // WorkSpace API Types
  // ============================================================================

  export interface MainChainInfo {
    symbol: string;
    coin: string;
    deposit_enabled: boolean;
    withdraw_enabled: boolean;
  }

  export interface CoinDetails {
    id: number;
    symbol: string;
    main_chain_symbol: string;
    contract_address: string;
    decimals: number;
    min_deposit: string;
    min_withdraw: string;
    deposit_enabled: boolean;
    withdraw_enabled: boolean;
  }

  export interface BlockHeightInfo {
    symbol: string;
    block_height: number;
  }

  export class WorkSpaceApi {
    constructor(config: MpcConfig);
    
    /**
     * Get supported main chains
     */
    getSupportMainChain(): Promise<ApiResponse<MainChainInfo[]>>;
    
    /**
     * Get coin details
     * @param params.symbol - Coin symbol
     */
    getCoinDetails(params: { symbol: string }): Promise<ApiResponse<CoinDetails>>;
    
    /**
     * Get last block height
     * @param params.symbol - Coin symbol
     */
    getLastBlockHeight(params: { symbol: string }): Promise<ApiResponse<BlockHeightInfo>>;
  }

  // ============================================================================
  // Wallet API Types
  // ============================================================================

  export interface CreateWalletParams {
    request_id: string;
    sub_wallet_name: string;
    app_show_status?: number; // 1=show, 2=hide
  }

  export interface WalletInfo {
    id: number;
    sub_wallet_name: string;
    app_show_status: number;
    created_at: number;
  }

  export interface GetWalletListParams extends PaginationParams {}

  export interface GetWalletInfoParams {
    sub_wallet_id: number;
  }

  export interface UpdateWalletStatusParams {
    sub_wallet_id: number;
    app_show_status: number; // 1=show, 2=hide
  }

  export interface GetWalletAssetsParams {
    sub_wallet_id: number;
    symbol?: string;
  }

  export interface WalletAsset {
    symbol: string;
    balance: string;
    locked: string;
  }

  export interface VerifyAddressParams {
    address: string;
    symbol: string;
  }

  export interface AddressInfo {
    is_valid: boolean;
    sub_wallet_id?: number;
  }

  export class WalletApi {
    constructor(config: MpcConfig);
    
    createWallet(params: CreateWalletParams): Promise<ApiResponse<WalletInfo>>;
    getWalletList(params?: GetWalletListParams): Promise<ApiResponse<WalletInfo[]>>;
    getWalletInfo(params: GetWalletInfoParams): Promise<ApiResponse<WalletInfo>>;
    updateWalletStatus(params: UpdateWalletStatusParams): Promise<ApiResponse<any>>;
    getWalletAssets(params: GetWalletAssetsParams): Promise<ApiResponse<WalletAsset[]>>;
    verifyAddress(params: VerifyAddressParams): Promise<ApiResponse<AddressInfo>>;
  }

  // ============================================================================
  // Deposit API Types
  // ============================================================================

  export interface GetDepositRecordsParams {
    request_ids: string[];
  }

  export interface DepositRecord {
    id: number;
    request_id: string;
    sub_wallet_id: number;
    symbol: string;
    contract_address?: string;
    base_symbol: string;
    amount: string;
    address_from: string;
    address_to: string;
    memo?: string;
    txid: string;
    confirmations: number;
    tx_height: number;
    status: number;
    created_at: number;
    updated_at: number;
  }

  export interface SyncDepositRecordsParams extends SyncParams {}

  export class DepositApi {
    constructor(config: MpcConfig);
    
    getDepositRecords(params: GetDepositRecordsParams): Promise<ApiResponse<DepositRecord[]>>;
    syncDepositRecords(params?: SyncDepositRecordsParams): Promise<ApiResponse<DepositRecord[]>>;
  }

  // ============================================================================
  // Withdraw API Types
  // ============================================================================

  export interface WithdrawParams {
    request_id: string;
    sub_wallet_id: number;
    symbol: string;
    amount: string;
    address_to: string;
    from?: string;
    memo?: string;
    remark?: string;
    outputs?: string;
    sign?: string;
  }

  export interface WithdrawResult {
    withdraw_id: number;
  }

  export interface WithdrawRecord {
    id: number;
    request_id: string;
    sub_wallet_id: number;
    symbol: string;
    contract_address?: string;
    base_symbol: string;
    address_from: string;
    address_to: string;
    memo?: string;
    amount: string;
    txid?: string;
    fee_symbol: string;
    fee: string;
    real_fee: string;
    status: number;
    confirmations: number;
    tx_height?: number;
    withdraw_source: number;
    created_at: number;
    updated_at: number;
  }

  export interface GetWithdrawRecordsParams {
    request_ids: string[];
  }

  export interface SyncWithdrawRecordsParams extends SyncParams {}

  export class WithdrawApi {
    constructor(config: MpcConfig);
    
    /**
     * Initiate withdrawal (with optional signature)
     * @param params - Withdrawal parameters
     * @param params.need_transaction_sign - Whether to sign the transaction (default: false)
     */
    withdraw(params: WithdrawParams & { need_transaction_sign?: boolean }): Promise<ApiResponse<WithdrawResult>>;
    getWithdrawRecords(params: GetWithdrawRecordsParams): Promise<ApiResponse<WithdrawRecord[]>>;
    syncWithdrawRecords(params?: SyncWithdrawRecordsParams): Promise<ApiResponse<WithdrawRecord[]>>;
  }

  // ============================================================================
  // Web3 API Types
  // ============================================================================

  export interface CreateWeb3TransParams {
    request_id: string;
    sub_wallet_id: number;
    chain_id: number;
    from_addr: string;
    to_addr: string;
    value: string;
    main_chain_symbol?: string;
    contract_address?: string;
    gas_price?: string;
    gas_limit?: string;
    input_data?: string;
    sign?: string;
  }

  export interface Web3TransResult {
    id: number;
  }

  export interface AccelerateWeb3TransParams {
    request_id: string;
    gas_price: string;
    gas_limit?: string;
  }

  export interface Web3Record {
    id: number;
    request_id: string;
    sub_wallet_id: number;
    chain_id: number;
    main_chain_symbol: string;
    from_addr: string;
    to_addr: string;
    value: string;
    contract_address?: string;
    txid?: string;
    status: number;
    created_at: number;
    updated_at: number;
  }

  export interface GetWeb3RecordsParams {
    request_ids: string[];
  }

  export interface SyncWeb3RecordsParams extends SyncParams {}

  export class Web3Api {
    constructor(config: MpcConfig);
    
    /**
     * Create Web3 transaction (with optional signature)
     * @param params - Web3 transaction parameters
     * @param params.need_transaction_sign - Whether to sign the transaction (default: false)
     */
    createWeb3Trans(params: CreateWeb3TransParams & { need_transaction_sign?: boolean }): Promise<ApiResponse<Web3TransResult>>;
    accelerationWeb3Trans(params: AccelerateWeb3TransParams): Promise<ApiResponse<any>>;
    getWeb3Records(params: GetWeb3RecordsParams): Promise<ApiResponse<Web3Record[]>>;
    syncWeb3Records(params?: SyncWeb3RecordsParams): Promise<ApiResponse<Web3Record[]>>;
  }

  // ============================================================================
  // AutoSweep API Types
  // ============================================================================

  export interface AutoCollectSubWalletsParams {
    sub_wallet_ids: number[];
  }

  export interface SetAutoCollectSymbolParams {
    symbol: string;
    auto_collect_status: number; // 1=enable, 2=disable
  }

  export interface AutoCollectRecord {
    id: number;
    sub_wallet_id: number;
    symbol: string;
    amount: string;
    txid?: string;
    status: number;
    created_at: number;
  }

  export interface SyncAutoCollectRecordsParams extends SyncParams {}

  export class AutoSweepApi {
    constructor(config: MpcConfig);
    
    autoCollectSubWallets(params: AutoCollectSubWalletsParams): Promise<ApiResponse<any>>;
    setAutoCollectSymbol(params: SetAutoCollectSymbolParams): Promise<ApiResponse<any>>;
    syncAutoCollectRecords(params?: SyncAutoCollectRecordsParams): Promise<ApiResponse<AutoCollectRecord[]>>;
  }

  // ============================================================================
  // Notify API Types
  // ============================================================================

  export interface NotifyData {
    id?: number;
    request_id?: string;
    sub_wallet_id?: number;
    symbol?: string;
    amount?: string;
    address_from?: string;
    address_to?: string;
    memo?: string;
    txid?: string;
    confirmations?: number;
    status?: number;
    created_at?: number;
    updated_at?: number;
    [key: string]: any;
  }

  export class NotifyApi {
    constructor(config: MpcConfig);
    
    /**
     * Decrypt notification data
     * @param cipher - Encrypted notification data
     */
    notifyRequest(cipher: string): NotifyData;
  }

  // ============================================================================
  // TronResource API Types
  // ============================================================================

  export interface CreateTronDelegateParams {
    request_id: string;
    receiver_address: string;
    resource: number; // 0=BANDWIDTH, 1=ENERGY
    amount: number;
    lock_period?: number;
  }

  export interface TronDelegateResult {
    id: number;
  }

  export interface TronResourceRecord {
    id: number;
    request_id: string;
    receiver_address: string;
    resource: number;
    amount: number;
    txid?: string;
    status: number;
    created_at: number;
  }

  export interface GetBuyResourceRecordsParams {
    request_ids: string[];
  }

  export interface SyncBuyResourceRecordsParams extends SyncParams {}

  export class TronResourceApi {
    constructor(config: MpcConfig);
    
    createTronDelegate(params: CreateTronDelegateParams): Promise<ApiResponse<TronDelegateResult>>;
    getBuyResourceRecords(params: GetBuyResourceRecordsParams): Promise<ApiResponse<TronResourceRecord[]>>;
    syncBuyResourceRecords(params?: SyncBuyResourceRecordsParams): Promise<ApiResponse<TronResourceRecord[]>>;
  }

  // ============================================================================
  // MPC Client
  // ============================================================================

  export class MpcClient {
    constructor(config: MpcConfig);
    
    static newBuilder(): MpcClientBuilder;
    
    getWorkSpaceApi(): WorkSpaceApi;
    getWalletApi(): WalletApi;
    getDepositApi(): DepositApi;
    getWithdrawApi(): WithdrawApi;
    getWeb3Api(): Web3Api;
    getAutoSweepApi(): AutoSweepApi;
    getNotifyApi(): NotifyApi;
    getTronResourceApi(): TronResourceApi;
  }

  export class MpcClientBuilder {
    setAppId(appId: string): this;
    setRsaPrivateKey(rsaPrivateKey: string): this;
    setApiKey(apiKey: string): this;
    setDomain(domain: string): this;
    setSignPrivateKey(signPrivateKey: string): this;
    setDebug(debug: boolean): this;
    build(): MpcClient;
  }
}
