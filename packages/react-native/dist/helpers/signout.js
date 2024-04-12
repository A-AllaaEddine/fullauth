"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
/**
 * Destory user session.
 *
 * @param {string} baseUrl -The url for your fullauth backend.
 */
const signOut = async ({ baseUrl }) => {
    try {
        // const resp = await fetch(
        //   `${
        //     baseUrl ??
        //     process.env.EXPO_PUBLIC_FULLAUTH_URL ??
        //     'http://localhost:3000'
        //   }/api/auth/signout`,
        //   {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json',
        //       ...(await authHeaders()),
        //     },
        //     body: JSON.stringify({}),
        //   }
        // );
        // if (!resp.ok) {
        //   throw new Error('Internal Server Error');
        // }
        await async_storage_1.default.removeItem('fullauth-session-token');
        await async_storage_1.default.removeItem('fullauth-session-csrf-token');
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
exports.default = signOut;
