import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import SelComClient, { BASE_URL_ENUM, MAIN_PATH_ENUM, URL_LIST_ORDER_PATH_ENUM, URL_CANCEL_ORDER_PATH_ENUM, minimalOrderPayLoadInterface, uSSDPaymentPayloadInterface } from '../src/index';

// Initialize Axios mock adapter
const mock = new MockAdapter(axios);

describe('SelComClient', () => {
    let client: SelComClient;

    beforeEach(() => {
        // Initialize SelComClient with dummy data
        client = new SelComClient(BASE_URL_ENUM.BASE_URL, 'dummyApiKey', 'dummyApiSecret');
    });

    afterEach(() => {
        // Reset Axios mock after each test
        mock.reset();
    });

    it('should create minimal order successfully', async () => {
        const mockResponse = {
            reference: '123456',
            resultcode: '000',
            result: 'SUCCESS',
            message: 'Order created successfully',
            data: [{
                gateway_buyer_uuid: 'uuid123',
                payment_token: 'token123',
                qr: 'qrCode',
                payment_gateway_url: 'https://example.com/payment'
            }]
        };

        mock.onPost(`${BASE_URL_ENUM.BASE_URL}${MAIN_PATH_ENUM.MINIMUM_ORDER_PATH}`).reply(200, mockResponse);

        const payload: minimalOrderPayLoadInterface = {
            vendor: 'VENDORTILL',
            order_id: '1218d5Qb',
            buyer_email: 'john@example.com',
            buyer_name: 'John Joh',
            buyer_phone: '255082555555',
            amount: 8000,
            webhook:"https://example.com",
            currency: 'TZS',
            buyer_remarks: 'None',
            merchant_remarks: 'None',
            no_of_items: 1
        };

        const response = await client.post(MAIN_PATH_ENUM.MINIMUM_ORDER_PATH, payload);

        expect(response.result).toBe('SUCCESS');
        expect(response.data[0].payment_token).toBe('token123');
    });

    it('should process USSD push payment', async () => {
        // Mock response
        const mockResponse = {
            reference: '456789',
            resultcode: '000',
            result: 'SUCCESS',
            message: 'USSD payment initiated',
            data: []
        };

        // Set mock for the post request
        mock.onPost(`${BASE_URL_ENUM.BASE_URL}${MAIN_PATH_ENUM.USSD_PUSH_PATH}`).reply(200, mockResponse);

        // USSD payment payload
        const payload: uSSDPaymentPayloadInterface = {
            transid: 'A1234',
            order_id: '1218d5Qb',
            msisdn: '255000000000'
        };

        // Call post method
        const response = await client.post(MAIN_PATH_ENUM.USSD_PUSH_PATH, payload);

        // Assertions
        expect(response.result).toBe('SUCCESS');
        expect(response.resultcode).toBe('000');
    });

    it('should get order list successfully', async () => {
        // Mock response
        const mockResponse = {
            reference: '123456',
            resultcode: '000',
            result: 'SUCCESS',
            message: 'Order list fetched successfully',
            data: [{
                order_id: '123',
                creation_date: '2023-02-10',
                amount: '1000',
                payment_status: 'PENDING'
            }]
        };

        // Set mock for the get request
        mock.onGet(`${BASE_URL_ENUM.BASE_URL}${URL_LIST_ORDER_PATH_ENUM.LIST_ORDERS}`).reply(200, mockResponse);

        // Order list payload
        const payload = {
            fromdate: '2023-02-10',
            todate: '2023-02-16'
        };

        // Call getOrderList method
        const response = await client.getOrderList(URL_LIST_ORDER_PATH_ENUM.LIST_ORDERS, payload);

        // Assertions
        expect(response.result).toBe('SUCCESS');
        expect(response.data[0].order_id).toBe('123');
    });

    it('should cancel order successfully', async () => {
        // Mock response
        const mockResponse = {
            reference: '789456',
            resultcode: '000',
            result: 'SUCCESS',
            message: 'Order cancelled successfully',
            data: []
        };

        // Set mock for the delete request
        mock.onDelete(`${BASE_URL_ENUM.BASE_URL}${URL_CANCEL_ORDER_PATH_ENUM.CANCEL_ORDER}`).reply(200, mockResponse);

        // Cancel order payload
        const payload = {
            order_id: '1218d00Y'
        };

        // Call cancelOrder method
        const response = await client.cancelOrder(URL_CANCEL_ORDER_PATH_ENUM.CANCEL_ORDER, payload);

        // Assertions
        expect(response.result).toBe('SUCCESS');
        expect(response.resultcode).toBe('000');
    });
});
