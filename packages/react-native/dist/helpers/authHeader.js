"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authHeaders = void 0;
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
/**
 * Function that return session token and csrf token for the headers
 *
 * @returns {string} token -  The session token.
 * @returns {string} csrfToken -  The csrf token.
 */
const authHeaders = async () => {
    const token = await async_storage_1.default.getItem('fullauth-session-token');
    const csrfToken = await async_storage_1.default.getItem('fullauth-session-csrf-token');
    return { token: token ?? '', csrfToken: csrfToken ?? '' };
};
exports.authHeaders = authHeaders;
