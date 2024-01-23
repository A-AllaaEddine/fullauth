'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signIn = async (provider, credentials) => {
    try {
        const providersResp = await fetch(`${process.env.NEXT_PUBLIC_FULLATH_URL ?? 'http://localhost:3000'}/api/auth/providers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ provider, isMobile: false }),
        });
        if (!providersResp.ok) {
            return {
                ok: false,
                error: 'Error while getting providers',
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
        const url = `${process.env.NEXT_PUBLIC_FULLAUTH_URL ?? 'http://localhost:3000'}/
      ${isCredentials ? 'callback' : 'signin'}/${provider}`;
        const signInResp = await fetch(isCredentials
            ? providers[provider].signInUrl
            : providers[provider].callbackUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ provider, credentials, isMobile: false }),
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
            // return {
            //   ok: false,
            //   message: data?.message,
            // };
        }
        return { ok: true, session: data.session };
    }
    catch (error) {
        // console.log('Sign in: ', error);
        throw error;
    }
};
exports.default = signIn;
