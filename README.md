# selcomussdclient

selcomussdclient is a TypeScript package for interacting with the Selcom API. It provides an easy-to-use interface for creating orders, processing payments, and managing transactions.

## Installation
```bash
npm install selcomussdclient
```

## Usage

### Initializing the Client

```typescript
import SelComClient, { BASE_URL_ENUM } from 'selcomussdclient';

const client = new SelComClient(
  BASE_URL_ENUM.BASE_URL,
  'your-api-key',
  'your-api-secret'
);
```

### Creating a Minimal Order

```typescript
import { MAIN_PATH_ENUM, minimalOrderPayLoadInterface } from 'selcom-client';

const orderPayload: minimalOrderPayLoadInterface = {
  vendor: 'your-vendor-id',
  order_id: 'unique-order-id',
  buyer_email: 'buyer@example.com',
  buyer_name: 'John Doe',
  buyer_phone: '255123456789',
  amount: 10000, // Amount in cents
  currency: 'TZS',
  buyer_remarks: 'Purchase of Product X',
  merchant_remarks: 'Internal reference: ABC123',
  no_of_items: 1
};

const response = await client.post(MAIN_PATH_ENUM.MINIMUM_ORDER_PATH, orderPayload);
console.log(response);
```

### Initiating USSD Push Payment

**Important Note:** The `order_id` used in this step should be the same as the one used when creating the minimal order. This ensures that the payment is associated with the correct order.

```typescript
import { MAIN_PATH_ENUM, uSSDPaymentPayloadInterface } from 'selcom-client';

const ussdPayload: uSSDPaymentPayloadInterface = {
  transid: 'unique-transaction-id',
  order_id: 'unique-order-id', // This should match the order_id used in Creating a Minimal Order
  msisdn: '255123456789'
};

const response = await client.post(MAIN_PATH_ENUM.USSD_PUSH_PATH, ussdPayload);
console.log(response);
```

### Listing Orders

```typescript
import { URL_LIST_ORDER_PATH_ENUM, ordersListPayloadInterface } from 'selcom-client';

const listOrdersPayload: ordersListPayloadInterface = {
  fromdate: '2024-01-01',
  todate: '2024-01-31'
};

const response = await client.getOrderList(URL_LIST_ORDER_PATH_ENUM.LIST_ORDERS, listOrdersPayload);
console.log(response);
```

### Cancelling an Order

```typescript
import { URL_CANCEL_ORDER_PATH_ENUM, orderCancelPayloadInterface } from 'selcom-client';

const cancelOrderPayload: orderCancelPayloadInterface = {
  order_id: 'existing-order-id'
};

const response = await client.cancelOrder(URL_CANCEL_ORDER_PATH_ENUM.CANCEL_ORDER, cancelOrderPayload);
console.log(response);
```

## Enum Structures

The package uses several enums to organize API endpoints and base URLs:

```typescript
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
```

## Interface Structures

The package includes several interfaces for request payloads and response data:

```typescript
export interface paymentResponse {
    transid: string;
    order_id: string;
    reference: string;
    result: 'SUCCESS' | 'FAIL';
    resultcode: string;
    payment_status: 'COMPLETED' | 'CANCELLED' | 'PENDING' | 'USERCANCELED';
}

export interface minimalOrderPayLoadInterface {
    vendor: string;
    order_id: string;
    buyer_email: string;
    buyer_name: string;
    buyer_phone: string;
    amount: number;
    currency: string;
    buyer_remarks: string;
    merchant_remarks: string;
    no_of_items: number;
}

export interface uSSDPaymentPayloadInterface {
    transid: string;
    order_id: string;
    msisdn: string;
}

export interface ordersListPayloadInterface {
    fromdate: string;
    todate: string;
}

export interface orderCancelPayloadInterface {
    order_id: string;
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

export interface OrderListResponseInterface {
    reference: string;
    resultcode: string;
    result: 'FAIL' | 'SUCCESS' | 'PENDING';
    message: string;
    data: orderData[];
}

export interface orderCancelResponseInterface {
    reference: string;
    resultcode: string;
    result: 'SUCCESS' | 'FAIL';
    message: string;
    data: [];
}
```

## Error Handling

The SelComClient methods return the API response data. In case of an error, they return the error response data. Always check the `result` field in the response to determine if the operation was successful.

```typescript
const response = await client.post(MAIN_PATH_ENUM.MINIMUM_ORDER_PATH, orderPayload);
if (response.result === 'SUCCESS') {
  console.log('Order created successfully:', response.data);
} else {
  console.error('Error creating order:', response.message);
}
```

## License

This project is licensed under the MIT License.