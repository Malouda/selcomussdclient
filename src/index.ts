import axios, { AxiosResponse } from 'axios';
import crypto from 'crypto';
import moment from "moment";


export enum BASE_URL_ENUM {
    BASE_URL = 'https://apigw.selcommobile.com/v1',
}

export enum MAIN_PATH_ENUM {
    MINIMUM_ORDER_PATH = '/checkout/create-order-minimal',
    USSD_PUSH_PATH = '/checkout/wallet-payment',
}

export enum URL_LIST_ORDER_PATH_ENUM {
    LIST_ORDERS = '/checkout/list-orders',
}
export enum URL_CANCEL_ORDER_PATH_ENUM {
    CANCEL_ORDER = '/v1/checkout/cancel-order',
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
    async post<T extends uSSDPaymentPayloadInterface | minimalOrderPayLoadInterface>(path: MAIN_PATH_ENUM | string, jsonData: T ): Promise<T extends uSSDPaymentPayloadInterface ? ussdPushResponseInterface : minimalOrderResponseInterface> {
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
}

export interface paymentResponse {
    transid: string;
    order_id: string;
    reference: string;
    result: 'SUCCESS' | 'FAIL';
    resultcode: string;
    payment_status: 'COMPLETED' | 'CANCELLED' | 'PENDING' | 'USERCANCELED';
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

