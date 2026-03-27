export declare enum BASE_URL_ENUM {
    BASE_URL = "https://apigw.selcommobile.com/v1"
}
export declare enum MAIN_PATH_ENUM {
    MINIMUM_ORDER_PATH = "/checkout/create-order-minimal",
    USSD_PUSH_PATH = "/checkout/wallet-payment",
    BANK_TRANSFER_PATH = "/qwiksend/process",
    WALLET_CASHIN_PATH = "/walletcashin/process"
}
export declare enum URL_LIST_ORDER_PATH_ENUM {
    LIST_ORDERS = "/checkout/list-orders"
}
export declare enum URL_CANCEL_ORDER_PATH_ENUM {
    CANCEL_ORDER = "/checkout/cancel-order"
}
export declare enum URL_ORDER_STATUS_PATH_ENUM {
    ORDER_STATUS = "/checkout/order-status"
}
export declare enum WALLET_LOOKUP_PATH_ENUM {
    WALLET_LOOKUP_PATH = "/walletcashin/namelookup"
}
export declare enum BANK_LOOKUP_PATH_ENUM {
    BANK_LOOKUP_PATH = "/qwiksend/lookup"
}
export declare enum FLOAT_ACCOUNT_BALANCE_PATH_ENUM {
    FLOAT_ACCOUNT_BALANCE_PATH = "/vendor/balance"
}
export declare enum BANK_TRANSFER_STATUS_PATH_ENUM {
    QUERY_STATUS_PATH = "/qwiksend/query"
}
export declare enum WALLET_CASHIN_QUERY_STATUS {
    QUERY_STATUS_PATH = "/walletcashin/query"
}
export default class SelComClient {
    baseUrl: string;
    apiKey: string;
    apiSecret: string;
    constructor(baseUrl: BASE_URL_ENUM | string, apiKey: string, apiSecret: string);
    computeHeader(jsonData: Record<string, any>): [string, string, string, string];
    post<T extends uSSDPaymentPayloadInterface | minimalOrderPayLoadInterface | BankTransferPayloadInterface | mobileMoneyTransferInterface>(path: MAIN_PATH_ENUM | string, jsonData: T): Promise<T extends BankTransferPayloadInterface ? BankTransferResponseInterface : T extends minimalOrderPayLoadInterface ? minimalOrderResponseInterface : T extends uSSDPaymentPayloadInterface ? ussdPushResponseInterface : T extends mobileMoneyTransferInterface ? MobileMoneyResponseInterface : never>;
    floatBalance<T extends FloatAccountBalanceRequestInterface>(path: FLOAT_ACCOUNT_BALANCE_PATH_ENUM.FLOAT_ACCOUNT_BALANCE_PATH | string, jsonData: T): Promise<FloatAccountBalanceResponseInterface>;
    bankLookup<T extends bankLookUpPayload>(path: BANK_LOOKUP_PATH_ENUM.BANK_LOOKUP_PATH | string, jsonData: T): Promise<PaymentLookupResponse>;
    walletCashinQueryStatus<T extends WalletTransactionQueryStatusRequestInterface>(path: WALLET_CASHIN_QUERY_STATUS.QUERY_STATUS_PATH | string, jsonData: T): Promise<WalletTransactionQueryStatusResppnseInterface>;
    bankTransferQueryStatus<T extends BankTransferStatusRequestInterface>(path: BANK_TRANSFER_STATUS_PATH_ENUM.QUERY_STATUS_PATH | string, jsonData: T): Promise<BankTransferStatusResponseInterface>;
    walletLookup<T extends WalletNameLookupInterface>(path: WALLET_LOOKUP_PATH_ENUM.WALLET_LOOKUP_PATH | string, jsonData: T): Promise<NameFetchResponseInterface>;
    getOrderList(path: URL_LIST_ORDER_PATH_ENUM | string, jsonData: ordersListPayloadInterface): Promise<OrderListResponseInterface>;
    cancelOrder(path: URL_CANCEL_ORDER_PATH_ENUM | string, jsonData: orderCancelPayloadInterface): Promise<orderCancelResponseInterface>;
    getOrderStatus(path: URL_ORDER_STATUS_PATH_ENUM | string, jsonData: orderStatusPayloadInterface): Promise<orderStatusResponseInterface>;
}
export interface paymentResponseInterface {
    result: 'SUCCESS' | 'FAILURE';
    resultcode: string;
    order_id: string;
    transid: string;
    reference: string;
    channel: string;
    amount: string;
    phone: string;
    payment_status: 'COMPLETED' | 'PENDING' | 'FAILED';
}
export interface ordersListPayloadInterface {
    fromdate: string;
    todate: string;
}
interface orderData {
    order_id: string;
    creation_date: string;
    amount: string;
    payment_status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'USERCANCELLED' | 'REJECTED' | 'INPROGRESS';
}
export interface OrderListResponseInterface {
    reference: string;
    resultcode: string;
    result: 'FAIL' | 'SUCCESS' | 'PENDING';
    message: string;
    data: orderData[];
}
export interface uSSDPaymentPayloadInterface {
    transid: string;
    order_id: string;
    msisdn: string;
}
export interface bankLookUpResponseInterface {
    bank: string;
    account: string;
    transid: string;
}
export interface PaymentLookupResponse {
    reference: string;
    transid: string;
    resultcode: string;
    result: string;
    message: string;
    data: Array<{
        name: string;
    }>;
}
export declare enum BANKS_ENUM {
    ACCESSBANK = "ACCESS BANK TANZANIA",
    BOBTZ = "BOB TANZANIA",
    CANARA = "CANARA TANZANIA",
    NCBATZ = "NCBA TANZANIA",
    ECOBANKTZ = "ECOBANK TANZANIA",
    CRDB = "CRDBBANK",
    LETSHEGO = "LETSHEGO BANK TANZANIA",
    ACB = "AKIBA COMMERCIAL BANK TANZANIA",
    AMANA = "AMANA BANK TANZANIA",
    BANCABC = "BANCABC TANZANIA",
    BOA = "BANK OF AFRICA TANZANIA",
    BARODA = "BANK OF BARODA TANZANIA",
    ABSA = "ABSA BANK TANZANIA",
    EQUITY = "EQUITY BANK TANZANIA",
    EXIM = "EXIM BANK TANZANIA",
    IMBANK = "I AND M BANK TANZANIA",
    KCB = "KENYA COMMERCIAL BANK LTD",
    MAENDELEO = "MAENDELEO BANK",
    MKOMBOZI = "MKOMBOZI COMMERCIAL BANK",
    NBC = "NATIONAL BANK OF COMMERCE",
    NMB = "NATIONAL MICROFINANCE BANK",
    STANBIC = "STANBIC BANK TANZANIA",
    SCB = "STANDARD CHARTERED BANK",
    TCB = "TANZANIA COMMERCIAL BANK",
    UBA = "UNITED BANK FOR AFRICA",
    YETUMFI = "YETU MICROFINANCE",
    AZANIA = "AZANIA TANZANIA",
    BOI = "BANK OF INDIA TANZANIA",
    DTB = "DIAMOND TRUST BANK",
    DCB = "DCB COMMERCIAL BANK",
    FINCA = "FINCA MICROFINANCE BANK",
    GTBANK = "GT BANK TANZANIA",
    HABIB = "HABIB BANK",
    ICB = "ICB BANK",
    KILIMANJARO = "KILIMANJARO COMMERCIAL BANK",
    MWALIMU = "MWALIMU COMMERCIAL BANK OF TANZANIA",
    MWANGA = "MWANGA HAKIKA MICROFINANCE BANK",
    PBZ = "PEOPLES BANK OF ZANZIBAR",
    UCHUMI = "UCHUMI COMMERCIAL BANK",
    CHINADASHENG = "CHINA DASHENG BANK LTD",
    CITIBANK = "CITIBANK TANZANIA LIMITED"
}
export interface bankLookUpPayload {
    bank: string;
    account: string;
    transid: string;
}
export interface NameFetchResponseInterface {
    reference: string;
    transid: string;
    resultcode: string;
    result: string;
    message: string;
    data: Array<{
        name: string;
    }>;
}
export interface minimalOrderPayLoadInterface {
    vendor: string;
    order_id: string;
    buyer_email: string;
    buyer_name: string;
    buyer_phone: string;
    amount: number;
    webhook: string;
    currency: string;
    buyer_remarks: string;
    merchant_remarks: string;
    no_of_items: number;
}
export interface BankTransferPayloadInterface {
    transid: string;
    recipientFiCode: string;
    recipientAccount: string;
    recipientName: string;
    senderAccount: string;
    senderName: string;
    amount: number;
    vendor: string;
    pin: string;
    msisdn: string;
    purpose: string;
    remarks: string;
}
export interface BankTransferResponseInterface {
    reference: string;
    transid: string;
    resultcode: string;
    result: string;
    message: string;
    data: any[];
}
interface minimalOrderData {
    gateway_buyer_uuid: string;
    payment_token: string;
    qr: string;
    payment_gateway_url: string;
}
export interface minimalOrderResponseInterface {
    reference: string;
    resultcode: string;
    result: 'SUCCESS' | 'FAIL';
    message: string;
    data: minimalOrderData[];
}
export interface ussdPushResponseInterface {
    reference: string;
    resultcode: string;
    result: 'SUCCESS' | 'FAIL';
    message: string;
    data: [];
}
export interface orderCancelPayloadInterface {
    order_id: string;
}
export interface orderCancelResponseInterface {
    reference: string;
    resultcode: string;
    result: 'SUCCESS' | 'FAIL';
    message: string;
    data: [];
}
export interface orderStatusPayloadInterface {
    order_id: string;
}
interface orderStatusData {
    order_id: string;
    creation_date: string;
    amount: string;
    payment_status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'USERCANCELLED' | 'REJECTED' | 'INPROGRESS' | 'FAILED';
    transid: string | null;
    channel: string | null;
    reference: string | null;
    phone: string | null;
}
export interface orderStatusResponseInterface {
    reference: string;
    resultcode: string;
    result: 'SUCCESS' | 'FAIL';
    message: string;
    data: orderStatusData[];
}
export interface FloatAccountBalanceRequestInterface {
    vendor: string;
    pin: string;
    transid: string;
}
export interface FloatAccountBalanceResponseInterface {
    reference: string;
    transid: string;
    resultcode: string;
    result: string;
    message: string;
    data: Array<{
        balance: string;
    }>;
}
export interface WalletTransactionQueryStatusRequestInterface {
    transid: string;
}
export interface mobileMoneyTransferInterface {
    transid: string;
    utilitycode: string;
    utilityref: string;
    amount: number;
    vendor: string;
    pin: string;
    msisdn: string;
}
export interface MobileMoneyResponseInterface {
    reference: string;
    transid: string;
    resultcode: string;
    result: string;
    message: string;
    data: any[];
}
export interface WalletNameLookupInterface {
    utilitycode: string;
    utilityref: string;
    transid: string;
}
export interface BankTransferStatusRequestInterface {
    transid: string;
}
export interface BankTransferStatusResponseInterface {
    messageId: string;
    reference: string;
    resultcode: string;
    result: string;
    message: string;
    data: Array<{
        receipt: string;
    }>;
}
export interface WalletTransactionQueryStatusResppnseInterface {
    messageId: string;
    reference: string;
    resultcode: string;
    result: string;
    message: string;
    data: Array<{
        receipt: string;
    }>;
}
export { };
