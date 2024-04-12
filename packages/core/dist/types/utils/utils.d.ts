import * as jose from 'jose';
import { Auth, AuthOptions, DbData, JWT, User } from '../types/types';
export declare function getBodyData(req: Request): Promise<Record<string, any> | undefined>;
export declare const generateToken: (payload: Partial<DbData> | Partial<JWT> | Record<string, string>, secret: string, maxAge?: number) => Promise<string>;
export declare function generateCsrfToken(secret: string, maxAge?: number): Promise<string>;
export declare const verifyToken: (token: string, secret: string) => Promise<jose.JWTVerifyResult<JWT & Record<string, any>>>;
export type ResponseProvider = {
    id: string;
    name: string;
    type: string;
    callbackUrl: string;
    signInUrl: string;
};
export declare function getProviders(options: AuthOptions, isMobile: boolean): Promise<ResponseProvider[]>;
export type DatabaseCallbackProps = {
    options: AuthOptions;
    updates: any;
    data: DbData;
    trigger: 'signin' | 'update' | undefined;
    auth: Auth | null;
    user: User | null;
};
export declare const databaseCallback: ({ options, updates, data, trigger, auth, user, }: DatabaseCallbackProps) => Promise<DbData>;
export type TokenCallbackProps = {
    options: AuthOptions;
    token: JWT | null;
    updates: any;
    trigger: 'signin' | 'update' | undefined;
    user: User | null;
    auth: Auth | null;
    isMobile: boolean;
};
export declare const tokenCallback: ({ options, token, updates, trigger, user, auth, isMobile, }: TokenCallbackProps) => Promise<JWT | null>;
export type ProviderCallbackProps = {
    options: AuthOptions;
    provider: string;
    credentials?: Record<string, string>;
    code?: string;
    redirectUrl?: string;
    isMobile: boolean;
};
export type ProviderCallbackResp = {
    user: User | null;
    auth: Auth | null;
};
export declare function ProviderCallback({ options, provider, credentials, code, isMobile, redirectUrl, }: ProviderCallbackProps): Promise<ProviderCallbackResp>;
export type ProviderSigninProps = {
    options: AuthOptions;
    provider: string;
    isMobile: boolean;
    redirectUrl: string;
};
export type ProviderSigninResp = {
    redirectURL?: string | null;
};
export declare function ProviderSignin({ options, provider, isMobile, redirectUrl, }: ProviderSigninProps): Promise<ProviderSigninResp>;
export declare const redirectCallback: (redirectUrl: string) => {
    url: string | undefined;
};
