"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
const authHeader_1 = require("./authHeader");
const utils_1 = require("../utils/utils");
const utils_2 = require("@fullauth/core/utils");
/**
 * Authenticates a user based on the selected provider.
 *
 * @param {string} baseUrl -The url for your fullauth backend.
 * @param {string} provider -The id of the provider.
 * @param {string} credentials - The credentials for the provider (only for credentials provider).
 * @returns {Promise<SigninResp>} A promise that returns session object on success.
 * @throws {AuthenticationError} If authentication fails, return error object.
 */
const signIn = async ({ baseUrl, provider, credentials, }) => {
    try {
        const providers = await (0, utils_1.getProviders)({ baseUrl: baseUrl });
        if (!providers[provider]) {
            throw new Error('Invalid provider');
        }
        const isCredentials = providers[provider].type === 'credentials';
        const signInResp = await fetch(isCredentials
            ? providers[provider].callbackUrl
            : providers[provider].signInUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(await (0, authHeader_1.authHeaders)()),
            },
            body: JSON.stringify({
                provider,
                credentials,
            }),
        });
        // const data: {
        //   ok: boolean;
        //   message: string;
        //   token: string;
        //   csrfToken: string;
        //   session: Session;
        // } = await signInResp.json();
        const data = await signInResp.json();
        if (!data.ok) {
            if (data.message === 'Session already exist') {
                return null;
            }
            if (data.message === 'jwt expired') {
                await async_storage_1.default.removeItem('fullauth-session-token');
                await async_storage_1.default.removeItem('fullauth-session-csrf-token');
                return null;
                // throw new Error('Session expired.');
            }
            if (data.error) {
                (0, utils_2.throwAppropriateError)(data.error);
            }
        }
        await async_storage_1.default.setItem('fullauth-session-token', data.token ?? '');
        await async_storage_1.default.setItem('fullauth-session-csrf-token', data.csrfToken ?? '');
        return { session: data.session };
    }
    catch (error) {
        console.log('signin error: ', error);
        throw error;
    }
};
exports.default = signIn;
