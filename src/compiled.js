"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BANKS_ENUM = exports.WALLET_CASHIN_QUERY_STATUS = exports.BANK_TRANSFER_STATUS_PATH_ENUM = exports.FLOAT_ACCOUNT_BALANCE_PATH_ENUM = exports.BANK_LOOKUP_PATH_ENUM = exports.WALLET_LOOKUP_PATH_ENUM = exports.URL_ORDER_STATUS_PATH_ENUM = exports.URL_CANCEL_ORDER_PATH_ENUM = exports.URL_LIST_ORDER_PATH_ENUM = exports.MAIN_PATH_ENUM = exports.BASE_URL_ENUM = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const moment_1 = __importDefault(require("moment"));
var BASE_URL_ENUM;
(function (BASE_URL_ENUM) {
    BASE_URL_ENUM["BASE_URL"] = "https://apigw.selcommobile.com/v1";
})(BASE_URL_ENUM || (exports.BASE_URL_ENUM = BASE_URL_ENUM = {}));
var MAIN_PATH_ENUM;
(function (MAIN_PATH_ENUM) {
    MAIN_PATH_ENUM["MINIMUM_ORDER_PATH"] = "/checkout/create-order-minimal";
    MAIN_PATH_ENUM["USSD_PUSH_PATH"] = "/checkout/wallet-payment";
    MAIN_PATH_ENUM["BANK_TRANSFER_PATH"] = "/qwiksend/process";
    MAIN_PATH_ENUM["WALLET_CASHIN_PATH"] = "/walletcashin/process";
})(MAIN_PATH_ENUM || (exports.MAIN_PATH_ENUM = MAIN_PATH_ENUM = {}));
var URL_LIST_ORDER_PATH_ENUM;
(function (URL_LIST_ORDER_PATH_ENUM) {
    URL_LIST_ORDER_PATH_ENUM["LIST_ORDERS"] = "/checkout/list-orders";
})(URL_LIST_ORDER_PATH_ENUM || (exports.URL_LIST_ORDER_PATH_ENUM = URL_LIST_ORDER_PATH_ENUM = {}));
var URL_CANCEL_ORDER_PATH_ENUM;
(function (URL_CANCEL_ORDER_PATH_ENUM) {
    URL_CANCEL_ORDER_PATH_ENUM["CANCEL_ORDER"] = "/checkout/cancel-order";
})(URL_CANCEL_ORDER_PATH_ENUM || (exports.URL_CANCEL_ORDER_PATH_ENUM = URL_CANCEL_ORDER_PATH_ENUM = {}));
var URL_ORDER_STATUS_PATH_ENUM;
(function (URL_ORDER_STATUS_PATH_ENUM) {
    URL_ORDER_STATUS_PATH_ENUM["ORDER_STATUS"] = "/checkout/order-status";
})(URL_ORDER_STATUS_PATH_ENUM || (exports.URL_ORDER_STATUS_PATH_ENUM = URL_ORDER_STATUS_PATH_ENUM = {}));
var WALLET_LOOKUP_PATH_ENUM;
(function (WALLET_LOOKUP_PATH_ENUM) {
    WALLET_LOOKUP_PATH_ENUM["WALLET_LOOKUP_PATH"] = "/walletcashin/namelookup";
})(WALLET_LOOKUP_PATH_ENUM || (exports.WALLET_LOOKUP_PATH_ENUM = WALLET_LOOKUP_PATH_ENUM = {}));
var BANK_LOOKUP_PATH_ENUM;
(function (BANK_LOOKUP_PATH_ENUM) {
    BANK_LOOKUP_PATH_ENUM["BANK_LOOKUP_PATH"] = "/qwiksend/lookup";
})(BANK_LOOKUP_PATH_ENUM || (exports.BANK_LOOKUP_PATH_ENUM = BANK_LOOKUP_PATH_ENUM = {}));
var FLOAT_ACCOUNT_BALANCE_PATH_ENUM;
(function (FLOAT_ACCOUNT_BALANCE_PATH_ENUM) {
    FLOAT_ACCOUNT_BALANCE_PATH_ENUM["FLOAT_ACCOUNT_BALANCE_PATH"] = "/vendor/balance";
})(FLOAT_ACCOUNT_BALANCE_PATH_ENUM || (exports.FLOAT_ACCOUNT_BALANCE_PATH_ENUM = FLOAT_ACCOUNT_BALANCE_PATH_ENUM = {}));
var BANK_TRANSFER_STATUS_PATH_ENUM;
(function (BANK_TRANSFER_STATUS_PATH_ENUM) {
    BANK_TRANSFER_STATUS_PATH_ENUM["QUERY_STATUS_PATH"] = "/qwiksend/query";
})(BANK_TRANSFER_STATUS_PATH_ENUM || (exports.BANK_TRANSFER_STATUS_PATH_ENUM = BANK_TRANSFER_STATUS_PATH_ENUM = {}));
var WALLET_CASHIN_QUERY_STATUS;
(function (WALLET_CASHIN_QUERY_STATUS) {
    WALLET_CASHIN_QUERY_STATUS["QUERY_STATUS_PATH"] = "/walletcashin/query";
})(WALLET_CASHIN_QUERY_STATUS || (exports.WALLET_CASHIN_QUERY_STATUS = WALLET_CASHIN_QUERY_STATUS = {}));
class SelComClient {
    constructor(baseUrl, apiKey, apiSecret) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
    }
    computeHeader(jsonData) {
        const authToken = "SELCOM" + ' ' + Buffer.from(this.apiKey, 'ascii').toString('base64');
        const now = new Date();
        const timestamp = (0, moment_1.default)(now).format("YYYY-MM-DD[T]HH:mm:ssZZ");
        let signedFields = "";
        let data = "timestamp=" + timestamp;
        for (const key in jsonData) {
            data = data + "&" + key + "=" + jsonData[key];
            signedFields = signedFields === '' ? key : signedFields + "," + key;
        }
        const hmac = crypto_1.default.createHmac('sha256', this.apiSecret);
        hmac.update(data);
        const digest = hmac.digest('base64');
        return [authToken, timestamp, digest, signedFields];
    }
    post(path, jsonData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [authToken, timestamp, digest, signedFields] = this.computeHeader(jsonData);
            console.log(this.baseUrl + path);
            try {
                const response = yield (0, axios_1.default)({
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
            }
            catch (error) {
                return error.response.data;
            }
        });
    }
    floatBalance(path, jsonData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [authToken, timestamp, digest, signedFields] = this.computeHeader(jsonData);
            console.log(this.baseUrl + path);
            try {
                const response = yield (0, axios_1.default)({
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
            }
            catch (error) {
                return error.response.data;
            }
        });
    }
    bankLookup(path, jsonData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [authToken, timestamp, digest, signedFields] = this.computeHeader(jsonData);
            const queryParams = new URLSearchParams(jsonData).toString();
            const fullUrl = `${this.baseUrl}${path}?${queryParams}`;
            console.log('GET URL with params:', fullUrl);
            try {
                const response = yield (0, axios_1.default)({
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
            }
            catch (error) {
                return error.response.data;
            }
        });
    }
    walletCashinQueryStatus(path, jsonData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [authToken, timestamp, digest, signedFields] = this.computeHeader(jsonData);
            const queryParams = new URLSearchParams(jsonData).toString();
            const fullUrl = `${this.baseUrl}${path}?${queryParams}`;
            console.log('GET URL with params:', fullUrl);
            try {
                const response = yield (0, axios_1.default)({
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
            }
            catch (error) {
                return error.response.data;
            }
        });
    }
    bankTransferQueryStatus(path, jsonData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [authToken, timestamp, digest, signedFields] = this.computeHeader(jsonData);
            const queryParams = new URLSearchParams(jsonData).toString();
            const fullUrl = `${this.baseUrl}${path}?${queryParams}`;
            console.log('GET URL with params:', fullUrl);
            try {
                const response = yield (0, axios_1.default)({
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
            }
            catch (error) {
                return error.response.data;
            }
        });
    }
    walletLookup(path, jsonData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [authToken, timestamp, digest, signedFields] = this.computeHeader(jsonData);
            console.log(this.baseUrl + path);
            try {
                const response = yield (0, axios_1.default)({
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
            }
            catch (error) {
                return error.response.data;
            }
        });
    }
    getOrderList(path, jsonData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [authToken, timestamp, digest, signedFields] = this.computeHeader(jsonData);
            const queryParams = new URLSearchParams(jsonData).toString();
            const fullUrl = `${this.baseUrl}${path}?${queryParams}`;
            console.log('GET URL with params:', fullUrl);
            try {
                const response = yield (0, axios_1.default)({
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
            }
            catch (error) {
                return error.response.data;
            }
        });
    }
    cancelOrder(path, jsonData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [authToken, timestamp, digest, signedFields] = this.computeHeader(jsonData);
            const queryParams = new URLSearchParams(jsonData).toString();
            const fullUrl = `${this.baseUrl}${path}?${queryParams}`;
            console.log('DELETE URL with params:', fullUrl);
            try {
                const response = yield (0, axios_1.default)({
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
            }
            catch (error) {
                return error.response.data;
            }
        });
    }
    getOrderStatus(path, jsonData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [authToken, timestamp, digest, signedFields] = this.computeHeader(jsonData);
            const queryParams = new URLSearchParams(jsonData).toString();
            const fullUrl = `${this.baseUrl}${path}?${queryParams}`;
            console.log('GET URL with params:', fullUrl);
            try {
                const response = yield (0, axios_1.default)({
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
            }
            catch (error) {
                return error.response.data;
            }
        });
    }
}
exports.default = SelComClient;
var BANKS_ENUM;
(function (BANKS_ENUM) {
    BANKS_ENUM["ACCESSBANK"] = "ACCESS BANK TANZANIA";
    BANKS_ENUM["BOBTZ"] = "BOB TANZANIA";
    BANKS_ENUM["CANARA"] = "CANARA TANZANIA";
    BANKS_ENUM["NCBATZ"] = "NCBA TANZANIA";
    BANKS_ENUM["ECOBANKTZ"] = "ECOBANK TANZANIA";
    BANKS_ENUM["CRDB"] = "CRDBBANK";
    BANKS_ENUM["LETSHEGO"] = "LETSHEGO BANK TANZANIA";
    BANKS_ENUM["ACB"] = "AKIBA COMMERCIAL BANK TANZANIA";
    BANKS_ENUM["AMANA"] = "AMANA BANK TANZANIA";
    BANKS_ENUM["BANCABC"] = "BANCABC TANZANIA";
    BANKS_ENUM["BOA"] = "BANK OF AFRICA TANZANIA";
    BANKS_ENUM["BARODA"] = "BANK OF BARODA TANZANIA";
    BANKS_ENUM["ABSA"] = "ABSA BANK TANZANIA";
    BANKS_ENUM["EQUITY"] = "EQUITY BANK TANZANIA";
    BANKS_ENUM["EXIM"] = "EXIM BANK TANZANIA";
    BANKS_ENUM["IMBANK"] = "I AND M BANK TANZANIA";
    BANKS_ENUM["KCB"] = "KENYA COMMERCIAL BANK LTD";
    BANKS_ENUM["MAENDELEO"] = "MAENDELEO BANK";
    BANKS_ENUM["MKOMBOZI"] = "MKOMBOZI COMMERCIAL BANK";
    BANKS_ENUM["NBC"] = "NATIONAL BANK OF COMMERCE";
    BANKS_ENUM["NMB"] = "NATIONAL MICROFINANCE BANK";
    BANKS_ENUM["STANBIC"] = "STANBIC BANK TANZANIA";
    BANKS_ENUM["SCB"] = "STANDARD CHARTERED BANK";
    BANKS_ENUM["TCB"] = "TANZANIA COMMERCIAL BANK";
    BANKS_ENUM["UBA"] = "UNITED BANK FOR AFRICA";
    BANKS_ENUM["YETUMFI"] = "YETU MICROFINANCE";
    BANKS_ENUM["AZANIA"] = "AZANIA TANZANIA";
    BANKS_ENUM["BOI"] = "BANK OF INDIA TANZANIA";
    BANKS_ENUM["DTB"] = "DIAMOND TRUST BANK";
    BANKS_ENUM["DCB"] = "DCB COMMERCIAL BANK";
    BANKS_ENUM["FINCA"] = "FINCA MICROFINANCE BANK";
    BANKS_ENUM["GTBANK"] = "GT BANK TANZANIA";
    BANKS_ENUM["HABIB"] = "HABIB BANK";
    BANKS_ENUM["ICB"] = "ICB BANK";
    BANKS_ENUM["KILIMANJARO"] = "KILIMANJARO COMMERCIAL BANK";
    BANKS_ENUM["MWALIMU"] = "MWALIMU COMMERCIAL BANK OF TANZANIA";
    BANKS_ENUM["MWANGA"] = "MWANGA HAKIKA MICROFINANCE BANK";
    BANKS_ENUM["PBZ"] = "PEOPLES BANK OF ZANZIBAR";
    BANKS_ENUM["UCHUMI"] = "UCHUMI COMMERCIAL BANK";
    BANKS_ENUM["CHINADASHENG"] = "CHINA DASHENG BANK LTD";
    BANKS_ENUM["CITIBANK"] = "CITIBANK TANZANIA LIMITED";
})(BANKS_ENUM || (exports.BANKS_ENUM = BANKS_ENUM = {}));
