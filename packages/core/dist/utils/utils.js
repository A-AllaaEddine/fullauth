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
export async function getProviders(options) {
    const url = process.env.NEXT_PUBLIC_FULLAUTH_URL ??
        process.env.EXPO_PUBLIC_FULLAUTH_URL ??
        'http://localhost:3000';
    const providers = options.providers.reduce((acc, provider) => {
        acc[provider.id] = {
            id: provider.id,
            name: provider.name,
            type: provider.type,
            callbackUrl: `${url}/api/auth/callback/${provider.id?.toLowerCase()}`,
            signInUrl: `${url}/api/auth/signin/${provider.id?.toLowerCase()}`,
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
export async function callProvider({ options, provider, credentials, }) {
    const selectedProvider = options.providers.find((prov) => prov.id === provider);
    let user = null;
    let auth = {
        providerId: selectedProvider?.type ?? null,
        providerType: selectedProvider?.type ?? null,
    };
    if (selectedProvider?.type === 'credentials' && credentials) {
        try {
            const data = await selectedProvider.signIn(credentials);
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
        }
        catch (error) {
            console.log('Provider: ', error);
            throw error;
        }
    }
    return { user, auth };
}
