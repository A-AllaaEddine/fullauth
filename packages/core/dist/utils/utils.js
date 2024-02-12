import * as jwt from 'jsonwebtoken';
export async function getBodyData(req) {
    if (!('body' in req) || !req.body || req.method !== 'POST')
        return;
    const contentType = req.headers.get('content-type');
    if (contentType?.includes('application/json')) {
        return await req.json();
    }
    else if (contentType?.includes('application/x-www-form-urlencoded')) {
        const params = new URLSearchParams(await req.text());
        return Object.fromEntries(params);
    }
}
export const generateToken = async (payload, secret, maxAge) => {
    if ('expiresAt' in payload && payload.expiresAt) {
        return jwt.sign(payload, secret ?? 'cIdaCk3VCRQgIMCX62KI7weqX2SrgDLE');
    }
    if ('exp' in payload && payload.exp) {
        return jwt.sign(payload, secret ?? 'cIdaCk3VCRQgIMCX62KI7weqX2SrgDLE');
    }
    return jwt.sign(payload, secret ?? 'cIdaCk3VCRQgIMCX62KI7weqX2SrgDLE', {
        expiresIn: maxAge ?? 60 * 60 * 24 * 7,
    });
};
export async function generateCsrfToken(secret, maxAge) {
    return await jwt.sign({}, secret ?? 'cIdaCk3VCRQgIMCX62KI7weqX2SrgDLE', {
        expiresIn: maxAge ?? 60 * 60 * 24 * 7,
    });
    // return await generateToken({}, secret!, maxAge ?? 60);
}
export const verifyToken = async (token, secret) => {
    try {
        return jwt.verify(token, secret ?? 'cIdaCk3VCRQgIMCX62KI7weqX2SrgDLE');
    }
    catch (error) {
        throw error;
    }
};
export async function getProviders(options, isMobile) {
    const url = process.env.NEXT_PUBLIC_FULLAUTH_URL ?? 'http://localhost:3000';
    const providers = options.providers.reduce((acc, provider) => {
        acc[provider.id] = {
            id: provider.id,
            name: provider.name,
            type: provider.type,
            callbackUrl: isMobile
                ? `${url}/api/auth/callback/mobile/${provider.id?.toLowerCase()}`
                : `${url}/api/auth/callback/${provider.id?.toLowerCase()}`,
            signInUrl: isMobile
                ? `${url}/api/auth/signin/mobile/${provider.id?.toLowerCase()}`
                : `${url}/api/auth/signin/${provider.id?.toLowerCase()}`,
        };
        return acc;
    }, {});
    return providers;
}
export const databaseCallback = async ({ options, updates, data, trigger, auth, user, }) => {
    const newSession = (options.callbacks?.database &&
        (await options.callbacks?.database({
            updates,
            data,
            trigger,
            auth,
            user,
        }))) ??
        data;
    return newSession;
};
export const tokenCallback = async ({ options, token, updates, trigger, user, auth, }) => {
    const newJwt = (options.callbacks?.token &&
        (await options.callbacks?.token({
            token: token,
            updates,
            trigger,
            user,
            auth,
        }))) ??
        token;
    return newJwt;
};
export async function ProviderCallback({ options, provider, credentials, code, isMobile, redirectUrl, }) {
    const selectedProvider = options.providers.find((prov) => prov.id === provider);
    if (selectedProvider?.type === 'credentials') {
        try {
            // if credentials are not provided when calling credentials provider
            if (!credentials) {
                throw new Error('Credentials must be valid when using Credentials Provider.');
            }
            const data = await selectedProvider.signIn(credentials);
            let user = null;
            let auth = {
                providerId: selectedProvider?.id ?? null,
                providerType: selectedProvider?.type ?? null,
            };
            if (data) {
                user = {
                    id: data?.id,
                    email: data?.email,
                    name: data?.name,
                };
                auth = {
                    ...auth,
                    email: data?.email,
                };
            }
            return { user, auth };
        }
        catch (error) {
            console.log('Provider: ', error);
            throw error;
        }
    }
    if (selectedProvider?.type === 'oauth') {
        try {
            if (!code) {
                throw new Error('Invalid authorization code');
            }
            const { user, auth } = await selectedProvider.ProviderCallback({
                clientId: selectedProvider.clientId,
                clientSecret: selectedProvider.clientSecret,
                code,
                isMobile,
            });
            return {
                user,
                auth: {
                    ...auth,
                    providerId: selectedProvider?.id ?? null,
                    providerType: selectedProvider?.type ?? null,
                },
            };
        }
        catch (error) {
            console.log('oauth provider: ', error);
            throw error;
        }
    }
    throw new Error('Invalid Provider');
}
export async function ProviderSignin({ options, provider, isMobile, redirectUrl, }) {
    const selectedProvider = options.providers.find((prov) => prov.id === provider);
    if (selectedProvider?.type === 'oauth') {
        const { clientId, clientSecret } = selectedProvider;
        const { redirectURL } = selectedProvider.ProviderSignin({
            isMobile,
            clientId,
            clientSecret,
            redirectUrl,
        });
        return { redirectURL };
    }
    return { redirectURL: null };
}
export const redirectCallback = (redirectUrl) => {
    if (redirectUrl?.startsWith('/')) {
        return { url: `${process.env.NEXT_PUBLIC_FULLAUTH_URL}${redirectUrl}` };
    }
    if (new URL(redirectUrl).origin === process.env.NEXT_PUBLIC_FULLAUTH_URL) {
        return { url: redirectUrl };
    }
    return { url: process.env.NEXT_PUBLIC_FULLAUTH_URL };
};
