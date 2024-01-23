"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
const authHeaders = async () => {
    const token = await async_storage_1.default.getItem('fullauth-session-token');
    const csrfToken = await async_storage_1.default.getItem('fullauth-session-csrf-token');
    return { token: token ?? '', csrfToken: csrfToken ?? '' };
};
exports.default = authHeaders;
