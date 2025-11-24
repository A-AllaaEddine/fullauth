import * as jose from 'jose';
import { CredentialError, CsrfTokenError, CustomError, InternaError, InvalidProviderError, MethodNotAllowedError, OAuthCallbackError, OAuthRedirectError, SessionTokenError, TokenError, } from './errors';
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
    const jwtConfig = {
        secret: new TextEncoder().encode(secret ?? 'cIdaCk3VCRQgIMCX62KI7weqX2SrgDLE'),
    };
    // if ('expiresAt' in payload && payload.expiresAt) {
    //   return await new jose.SignJWT(payload)
    //     .setIssuedAt()
    //     .setIssuer('fullauth')
    //     .sign(jwtConfig.secret);
    // }
    // if ('exp' in payload && payload.exp) {
    //   return await new jose.SignJWT(payload)
    //     .setIssuedAt()
    //     .setIssuer('fullauth')
    //     .sign(jwtConfig.secret);
    // }
    return await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setIssuer('fullauth')
        .setExpirationTime(`${maxAge ?? 60 * 60 * 24 * 7} minutes`)
        .sign(jwtConfig.secret);
};
export async function generateCsrfToken(secret, maxAge) {
    const jwtConfig = {
        secret: new TextEncoder().encode(secret ?? 'cIdaCk3VCRQgIMCX62KI7weqX2SrgDLE'),
    };
    return await new jose.SignJWT({ csrf: true })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setIssuer('fullauth')
        .setExpirationTime(`${maxAge ?? 60 * 60 * 24 * 7} minutes`)
        .sign(jwtConfig.secret);
    // return await generateToken({}, secret!, maxAge ?? 60);
}
export const verifyToken = async (token, secret) => {
    const jwtConfig = {
        secret: new TextEncoder().encode(secret ?? 'cIdaCk3VCRQgIMCX62KI7weqX2SrgDLE'),
    };
    try {
        return await jose.jwtVerify(token, jwtConfig.secret);
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
export const tokenCallback = async ({ options, token, updates, trigger, user, auth, isMobile, }) => {
    try {
        const newJwt = (options.callbacks?.token &&
            (await options.callbacks?.token({
                token: token,
                updates,
                trigger,
                user,
                auth,
                platform: isMobile ? 'mobile' : 'web',
            }))) ??
            token;
        return newJwt;
    }
    catch (error) {
        if (error instanceof CustomError) {
            throw new CustomError(error.message, error.body);
        }
        throw new TokenError(undefined).toJSON();
    }
};
export async function ProviderCallback({ options, provider, credentials, code, isMobile, redirectUrl, }) {
    const selectedProvider = options.providers.find((prov) => prov.id === provider);
    if (selectedProvider?.type === 'credentials') {
        try {
            // if credentials are not provided when calling credentials provider
            if (!credentials) {
                throw new CredentialError('No Credentials');
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
            if (error instanceof CustomError) {
                throw new CustomError(error.message, error.body);
            }
            throw new CredentialError(undefined).toJSON();
        }
    }
    // TODO: Add OAuthProviderError
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
            if (error instanceof CustomError) {
                throw new CustomError(error.message, error.body);
            }
            throw new OAuthCallbackError(undefined).toJSON();
        }
    }
    // TODO: Add ProviderErrorObject
    throw new InvalidProviderError();
    // throw new Error('Invalid Provider');
}
export async function ProviderSignin({ options, provider, isMobile, redirectUrl, }) {
    const selectedProvider = options.providers.find((prov) => prov.id === provider);
    if (selectedProvider?.type === 'oauth') {
        try {
            const { clientId, clientSecret } = selectedProvider;
            const { redirectURL } = selectedProvider.ProviderSignin({
                isMobile,
                clientId,
                clientSecret,
                redirectUrl,
            });
            return { redirectURL };
        }
        catch (error) {
            if (error instanceof CustomError) {
                throw new CustomError(error.message, error.body);
            }
            throw new OAuthCallbackError(undefined).toJSON();
        }
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
export const throwAppropriateError = (error) => {
    switch (error.type) {
        case 'CredentialError':
            throw new CredentialError(error?.message, error?.body).toJSON();
        case 'CustomError':
            throw new CustomError(error?.message, error?.body).toJSON();
        case 'InvalidProvider':
            throw new InvalidProviderError(error?.message, error?.body).toJSON();
        case 'TokenError':
            throw new TokenError(error?.message, error?.body).toJSON();
        case 'OAuthCallbackError':
            throw new OAuthCallbackError(error?.message, error?.body).toJSON();
        case 'OAuthRedirectError':
            throw new OAuthRedirectError(error?.message, error?.body).toJSON();
        case 'SessionTokenError':
            throw new SessionTokenError(error?.message, error?.body).toJSON();
        case 'CsrfTokenError':
            throw new CsrfTokenError(error?.message, error?.body).toJSON();
        case 'MethodNotAllowedError':
            throw new MethodNotAllowedError(error?.message, error?.body).toJSON();
        case 'InternalError':
            throw new InternaError(error?.message, error?.body).toJSON();
        default:
            throw new InternaError(error?.message, error?.body).toJSON();
    }
};
export const returnAppropriateError = (error) => {
    let formattedError;
    switch (error.type) {
        case 'CredentialError':
            formattedError = new CredentialError(error?.message, error?.body).toJSON();
            break;
        case 'CustomError':
            formattedError = new CustomError(error?.message, error?.body).toJSON();
            break;
        case 'InvalidProvider':
            formattedError = new InvalidProviderError(error?.message, error?.body).toJSON();
            break;
        case 'TokenError':
            formattedError = new TokenError(error?.message, error?.body).toJSON();
            break;
        case 'OAuthCallbackError':
            formattedError = new OAuthCallbackError(error?.message, error?.body).toJSON();
            break;
        case 'OAuthRedirectError':
            formattedError = new OAuthRedirectError(error?.message, error?.body).toJSON();
            break;
        case 'SessionTokenError':
            formattedError = new SessionTokenError(error?.message, error?.body).toJSON();
            break;
        case 'CsrfTokenError':
            formattedError = new CsrfTokenError(error?.message, error?.body).toJSON();
            break;
        case 'MethodNotAllowedError':
            formattedError = new MethodNotAllowedError(error?.message, error?.body).toJSON();
            break;
        case 'InternalError':
            formattedError = new InternaError(error?.message, error?.body).toJSON();
            break;
        default:
            formattedError = new InternaError(error?.message, error?.body).toJSON();
            break;
    }
    return formattedError;
};
