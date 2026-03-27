import axios, { AxiosResponse } from 'axios';
import crypto from 'crypto';
import moment from "moment";


export enum BASE_URL_ENUM {
    BASE_URL = 'https://apigw.selcommobile.com/v1',
}

export enum MAIN_PATH_ENUM {
    MINIMUM_ORDER_PATH = '/checkout/create-order-minimal',
    USSD_PUSH_PATH = '/checkout/wallet-payment',
    BANK_TRANSFER_PATH = '/qwiksend/process',
    WALLET_CASHIN_PATH = "/walletcashin/process",
    CREATE_TILL_ALIAS_PATH = '/checkout/create-till-alias',
}

export enum URL_LIST_ORDER_PATH_ENUM {
    LIST_ORDERS = '/checkout/list-orders',
}
export enum URL_CANCEL_ORDER_PATH_ENUM {
    CANCEL_ORDER = '/checkout/cancel-order',
}

export enum URL_ORDER_STATUS_PATH_ENUM {
    ORDER_STATUS = '/checkout/order-status',
}

export enum WALLET_LOOKUP_PATH_ENUM {
    WALLET_LOOKUP_PATH = '/walletcashin/namelookup',
}

export enum BANK_LOOKUP_PATH_ENUM {
    BANK_LOOKUP_PATH = '/qwiksend/lookup',
}

export enum FLOAT_ACCOUNT_BALANCE_PATH_ENUM {
    FLOAT_ACCOUNT_BALANCE_PATH = '/vendor/balance',
}

export enum BANK_TRANSFER_STATUS_PATH_ENUM {
    QUERY_STATUS_PATH = '/qwiksend/query',
}

export enum WALLET_CASHIN_QUERY_STATUS {
    QUERY_STATUS_PATH = '/walletcashin/query',
}




export default class SelComClient {
    baseUrl: string;
    apiKey: string;
    apiSecret: string;

    constructor(baseUrl: BASE_URL_ENUM |string, apiKey: string, apiSecret: string) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
    }

    computeHeader(jsonData: Record<string, any>): [string, string, string, string] {
        const authToken = "SELCOM" + ' ' + Buffer.from(this.apiKey, 'ascii').toString('base64');
        const now = new Date();
        const timestamp = moment(now).format("YYYY-MM-DD[T]HH:mm:ssZZ");
        let signedFields = "";
        let data = "timestamp=" + timestamp;

        for (const key in jsonData) {
            data = data + "&" + key + "=" + jsonData[key];
            signedFields = signedFields === '' ? key : signedFields + "," + key;
        }

        const hmac = crypto.createHmac('sha256', this.apiSecret);
        hmac.update(data);
        const digest = hmac.digest('base64');

        return [authToken, timestamp, digest, signedFields];
    }
    async post<T extends uSSDPaymentPayloadInterface | minimalOrderPayLoadInterface | BankTransferPayloadInterface | mobileMoneyTransferInterface>(path: MAIN_PATH_ENUM | string, jsonData: T ): Promise<T extends uSSDPaymentPayloadInterface ? ussdPushResponseInterface : minimalOrderResponseInterface> {
        const [authToken, timestamp, digest, signedFields] = this.computeHeader(jsonData);
        console.log(this.baseUrl + path);
        try {
            const response: AxiosResponse<any> = await axios({
                method: 'post',
                url: this.baseUrl + path,
                headers: {
                    "Content-type": "application/json",
                    "Authorization": authToken,
                    "Digest-Method": "HS256",
                    "Digest": digest,
                    "Timestamp": timestamp,
                    "Signed-Fields": signedFields,
                },
                data: jsonData,
            });
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    }

    async getOrderList(path: URL_LIST_ORDER_PATH_ENUM | string, jsonData: ordersListPayloadInterface): Promise<OrderListResponseInterface> {
        const [authToken, timestamp, digest, signedFields] = this.computeHeader(jsonData);

        try {
            const response: AxiosResponse<any> = await axios({
                method: 'get',
                url: this.baseUrl + path,
                headers: {
                    "Content-type": "application/json",
                    "Authorization": authToken,
                    "Digest-Method": "HS256",
                    "Digest": digest,
                    "Timestamp": timestamp,
                    "Signed-Fields": signedFields,
                },
                params: jsonData,
            });
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    }

    async cancelOrder(path: URL_CANCEL_ORDER_PATH_ENUM | string, jsonData: orderCancelPayloadInterface): Promise<orderCancelResponseInterface> {
        const [authToken, timestamp, digest, signedFields] = this.computeHeader(jsonData);

        try {
            const response: AxiosResponse<any> = await axios({
                method: 'delete',
                url: this.baseUrl + path,
                headers: {
                    "Content-type": "application/json",
                    "Authorization": authToken,
                    "Digest-Method": "HS256",
                    "Digest": digest,
                    "Timestamp": timestamp,
                    "Signed-Fields": signedFields,
                },
                params: jsonData,
            });
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    }

    async createTillAlias(jsonData: createTillAliasPayloadInterface): Promise<createTillAliasResponseInterface> {
        const [authToken, timestamp, digest, signedFields] = this.computeHeader(jsonData);

        try {
            const response: AxiosResponse<any> = await axios({
                method: 'post',
                url: this.baseUrl + MAIN_PATH_ENUM.CREATE_TILL_ALIAS_PATH,
                headers: {
                    "Content-type": "application/json",
                    "Authorization": authToken,
                    "Digest-Method": "HS256",
                    "Digest": digest,
                    "Timestamp": timestamp,
                    "Signed-Fields": signedFields,
                },
                data: jsonData,
            });
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    }

    async floatBalance(path: FLOAT_ACCOUNT_BALANCE_PATH_ENUM | string, jsonData: FloatAccountBalanceRequestInterface): Promise<FloatAccountBalanceResponseInterface> {
        const [authToken, timestamp, digest, signedFields] = this.computeHeader(jsonData);
        console.log(this.baseUrl + path);
        try {
            const response: AxiosResponse<any> = await axios({
                method: 'post',
                url: this.baseUrl + path,
                headers: {
                    "Content-type": "application/json",
                    "Authorization": authToken,
                    "Digest-Method": "HS256",
                    "Digest": digest,
                    "Timestamp": timestamp,
                    "Signed-Fields": signedFields,
                },
                data: jsonData,
            });
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    }

    async bankLookup(path: BANK_LOOKUP_PATH_ENUM | string, jsonData: bankLookUpPayload): Promise<PaymentLookupResponse> {
        const [authToken, timestamp, digest, signedFields] = this.computeHeader(jsonData);
        console.log('GET URL with params:', `${this.baseUrl}${path}?${new URLSearchParams(jsonData as unknown as Record<string, string>).toString()}`);
        try {
            const response: AxiosResponse<any> = await axios({
                method: 'get',
                url: this.baseUrl + path,
                headers: {
                    "Content-type": "application/json",
                    "Authorization": authToken,
                    "Digest-Method": "HS256",
                    "Digest": digest,
                    "Timestamp": timestamp,
                    "Signed-Fields": signedFields,
                },
                params: jsonData,
            });
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    }

    async walletCashinQueryStatus(path: WALLET_CASHIN_QUERY_STATUS | string, jsonData: WalletTransactionQueryStatusRequestInterface): Promise<WalletTransactionQueryStatusResppnseInterface> {
        const [authToken, timestamp, digest, signedFields] = this.computeHeader(jsonData);
        console.log('GET URL with params:', `${this.baseUrl}${path}?${new URLSearchParams(jsonData as unknown as Record<string, string>).toString()}`);
        try {
            const response: AxiosResponse<any> = await axios({
                method: 'get',
                url: this.baseUrl + path,
                headers: {
                    "Content-type": "application/json",
                    "Authorization": authToken,
                    "Digest-Method": "HS256",
                    "Digest": digest,
                    "Timestamp": timestamp,
                    "Signed-Fields": signedFields,
                },
                params: jsonData,
            });
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    }

    async bankTransferQueryStatus(path: BANK_TRANSFER_STATUS_PATH_ENUM | string, jsonData: BankTransferStatusRequestInterface): Promise<BankTransferStatusResponseInterface> {
        const [authToken, timestamp, digest, signedFields] = this.computeHeader(jsonData);
        console.log('GET URL with params:', `${this.baseUrl}${path}?${new URLSearchParams(jsonData as unknown as Record<string, string>).toString()}`);
        try {
            const response: AxiosResponse<any> = await axios({
                method: 'get',
                url: this.baseUrl + path,
                headers: {
                    "Content-type": "application/json",
                    "Authorization": authToken,
                    "Digest-Method": "HS256",
                    "Digest": digest,
                    "Timestamp": timestamp,
                    "Signed-Fields": signedFields,
                },
                params: jsonData,
            });
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    }

    async walletLookup(path: WALLET_LOOKUP_PATH_ENUM | string, jsonData: WalletNameLookupInterface): Promise<NameFetchResponseInterface> {
        const [authToken, timestamp, digest, signedFields] = this.computeHeader(jsonData);
        console.log(this.baseUrl + path);
        try {
            const response: AxiosResponse<any> = await axios({
                method: 'get',
                url: this.baseUrl + path,
                headers: {
                    "Content-type": "application/json",
                    "Authorization": authToken,
                    "Digest-Method": "HS256",
                    "Digest": digest,
                    "Timestamp": timestamp,
                    "Signed-Fields": signedFields,
                },
                params: jsonData,
            });
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    }

    async getOrderStatus(path: URL_ORDER_STATUS_PATH_ENUM | string, jsonData: orderStatusPayloadInterface): Promise<orderStatusResponseInterface> {
        const [authToken, timestamp, digest, signedFields] = this.computeHeader(jsonData);
        console.log('GET URL with params:', `${this.baseUrl}${path}?${new URLSearchParams(jsonData as unknown as Record<string, string>).toString()}`);
        try {
            const response: AxiosResponse<any> = await axios({
                method: 'get',
                url: this.baseUrl + path,
                headers: {
                    "Content-type": "application/json",
                    "Authorization": authToken,
                    "Digest-Method": "HS256",
                    "Digest": digest,
                    "Timestamp": timestamp,
                    "Signed-Fields": signedFields,
                },
                params: jsonData,
            });
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    }
}

export interface paymentResponseInterface {
    result: 'SUCCESS' | 'FAILURE'; // Assuming these are the possible values
    resultcode: string;
    order_id: string;
    transid: string;
    reference: string;
    channel: string;
    amount: string;
    phone: string;
    payment_status: 'COMPLETED' | 'PENDING' | 'FAILED'; // Assuming these are the possible values
}

export interface ordersListPayloadInterface {
    fromdate: string;
    todate: string;
}


interface orderData {
    order_id: string;
    creation_date: string;
    amount: string;
    payment_status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'USERCANCELLED' | 'REJECTED' | 'INPROGRESS'; // Updated possible statuses
}

export interface OrderListResponseInterface {
    reference: string;
    resultcode: string;
    result: 'FAIL' | 'SUCCESS' | 'PENDING'; // Updated possible values for the result
    message: string;
    data: orderData[]; // Array of OrderData objects
}

export interface uSSDPaymentPayloadInterface {
    transid: string;
    order_id: string;
    msisdn: string;
}

export interface minimalOrderPayLoadInterface {
    vendor: string;
    order_id: string;
    buyer_email: string;
    buyer_name: string;
    buyer_phone: string;
    amount: number;
    webhook: string,
    currency: string;
    buyer_remarks: string;
    merchant_remarks: string;
    no_of_items: number;
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

export interface createTillAliasPayloadInterface {
    vendor: string;
    name: string;
    memo: string;
}

interface tillAliasData {
    till_alias: string;
}

export interface createTillAliasResponseInterface {
    reference: string;
    resultcode: string;
    result: 'SUCCESS' | 'FAIL';
    message: string;
    data: tillAliasData[];
}

export interface createTillAliasWebhookPayloadInterface {
    result: 'SUCCESS' | 'FAIL';
    resultcode: string;
    order_id: string;
    transid: string;
    reference: string;
    channel: string;
    amount: string;
    phone: string;
    payment_status: 'COMPLETED' | 'PENDING' | 'CANCELLED' | 'USERCANCELED';
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
    result: 'SUCCESS' | 'FAIL';
    message: string;
    data: Array<{ balance: string }>;
}

export interface bankLookUpResponseInterface {
    bank: string;
    account: string;
    transid: string;
}

export interface bankLookUpPayload {
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
    data: Array<{ name: string }>;
}

export interface NameFetchResponseInterface {
    reference: string;
    transid: string;
    resultcode: string;
    result: string;
    message: string;
    data: Array<{ name: string }>;
}

export interface MobileMoneyResponseInterface {
    reference: string;
    transid: string;
    resultcode: string;
    result: string;
    message: string;
    data: any[];
}

export interface BankTransferResponseInterface {
    reference: string;
    transid: string;
    resultcode: string;
    result: string;
    message: string;
    data: any[];
}

export interface WalletTransactionQueryStatusRequestInterface {
    transid: string;
}

export interface WalletTransactionQueryStatusResppnseInterface {
    messageId: string;
    reference: string;
    resultcode: string;
    result: string;
    message: string;
    data: Array<{ receipt: string }>;
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
    data: Array<{ receipt: string }>;
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

export enum BANKS_ENUM {
    ACCESSBANK = 'ACCESS BANK TANZANIA',
    BOBTZ = 'BOB TANZANIA',
    CANARA = 'CANARA TANZANIA',
    NCBATZ = 'NCBA TANZANIA',
    ECOBANKTZ = 'ECOBANK TANZANIA',
    CRDB = 'CRDBBANK',
    LETSHEGO = 'LETSHEGO BANK TANZANIA',
    ACB = 'AKIBA COMMERCIAL BANK TANZANIA',
    AMANA = 'AMANA BANK TANZANIA',
    BANCABC = 'BANCABC TANZANIA',
    BOA = 'BANK OF AFRICA TANZANIA',
    BARODA = 'BANK OF BARODA TANZANIA',
    ABSA = 'ABSA BANK TANZANIA',
    EQUITY = 'EQUITY BANK TANZANIA',
    EXIM = 'EXIM BANK TANZANIA',
    IMBANK = 'I AND M BANK TANZANIA',
    KCB = 'KENYA COMMERCIAL BANK LTD',
    MAENDELEO = 'MAENDELEO BANK',
    MKOMBOZI = 'MKOMBOZI COMMERCIAL BANK',
    NBC = 'NATIONAL BANK OF COMMERCE',
    NMB = 'NATIONAL MICROFINANCE BANK',
    STANBIC = 'STANBIC BANK TANZANIA',
    SCB = 'STANDARD CHARTERED BANK',
    TCB = 'TANZANIA COMMERCIAL BANK',
    UBA = 'UNITED BANK FOR AFRICA',
    YETUMFI = 'YETU MICROFINANCE',
    AZANIA = 'AZANIA TANZANIA',
    BOI = 'BANK OF INDIA TANZANIA',
    DTB = 'DIAMOND TRUST BANK',
    DCB = 'DCB COMMERCIAL BANK',
    FINCA = 'FINCA MICROFINANCE BANK',
    GTBANK = 'GT BANK TANZANIA',
    HABIB = 'HABIB BANK',
    ICB = 'ICB BANK',
    KILIMANJARO = 'KILIMANJARO COMMERCIAL BANK',
    MWALIMU = 'MWALIMU COMMERCIAL BANK OF TANZANIA',
    MWANGA = 'MWANGA HAKIKA MICROFINANCE BANK',
    PBZ = 'PEOPLES BANK OF ZANZIBAR',
    UCHUMI = 'UCHUMI COMMERCIAL BANK',
    CHINADASHENG = 'CHINA DASHENG BANK LTD',
    CITIBANK = 'CITIBANK TANZANIA LIMITED',
}
