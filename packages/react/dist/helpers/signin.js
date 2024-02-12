'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
/**
 * Authenticates a user based on the selected provider.
 *
 * @param {string} provider -The id of the provider.
 * @param {string} credentials - The credentials for the provider (only for credentials provider).
 * @returns {Promise<SigninResp>} A promise that returns session object on success.
 * @throws {AuthenticationError} If authentication fails, return error object.
 */
const signIn = async (provider, options) => {
    try {
        const { credentials, redirect = true, redirectUrl = window.location.href, } = options ?? {};
        const providers = await (0, utils_1.getProviders)();
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
            },
            body: JSON.stringify({
                provider,
                credentials,
                ...(redirect && { redirectUrl }),
            }),
        });
        const data = await signInResp.json();
        if (!data.ok) {
            if (data.message === 'Session already exist') {
                return null;
            }
            if (data.message === 'jwt expired') {
                document.cookie =
                    'fullauth-session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                // return null;
                throw new Error('Session expired.');
            }
            throw new Error(data.message);
        }
        if (data?.redirect) {
            window.location.href = data.redirect;
            return null;
        }
        // if (redirect) {
        //   window.location.href = redirectUrl;
        // } else {
        //   window.location.reload();
        // }
        return { session: data.session ?? null };
    }
    catch (error) {
        // console.log('Sign in: ', error);
        throw error;
    }
};
exports.default = signIn;
