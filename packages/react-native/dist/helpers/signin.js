"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
const signIn = async (provider, credentials) => {
    try {
        const providersResp = await fetch(`${process.env.EXPO_PUBLIC_FULLAUTH_URL ?? 'http://localhost:3000'}/api/auth/providers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ provider, credentials, isMobile: false }),
        });
        if (!providersResp.ok) {
            return {
                ok: false,
                error: 'Internal Server Error',
            };
        }
        const providers = await providersResp.json();
        if (!providers[provider]) {
            return {
                ok: false,
                error: 'Invalid provider',
            };
        }
        const isCredentials = providers[provider].type === 'credentials';
        const url = `${process.env.EXPO_PUBLIC_FULLAUTH_URL ?? 'http://localhost:3000'}/
      ${isCredentials ? 'callback' : 'signin'}/${provider}`;
        const token = await async_storage_1.default.getItem('fullauth-session-token');
        const csrfToken = await async_storage_1.default.getItem('fullauth-session-csrf-token');
        const signInResp = await fetch(isCredentials
            ? providers[provider].signInUrl
            : providers[provider].callbackUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                provider,
                credentials,
                isMobile: true,
                token: token,
                csrfToken: csrfToken,
            }),
        });
        const data = await signInResp.json();
        if (!data.ok) {
            if (data.message === 'Session already exist') {
                return null;
            }
            if (data.message === 'jwt expired') {
                await async_storage_1.default.removeItem('fullauth-session-token');
                throw new Error('Session expired.');
            }
            throw new Error(data.message);
        }
        await async_storage_1.default.setItem('fullauth-session-token', data.token);
        await async_storage_1.default.setItem('fullauth-session-csrf-token', data.csrfToken);
        return { ok: true, session: data.session };
    }
    catch (error) {
        // console.log(error);
        throw error;
    }
};
exports.default = signIn;
