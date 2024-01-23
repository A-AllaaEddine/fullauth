import { Auth, AuthOptions, DbData, JWT, User } from '../types/types';
export declare function getBodyData(req: Request): Promise<Record<string, any> | undefined>;
export declare const generateToken: (payload: Partial<DbData> | Partial<JWT> | Record<string, string>, secret: string, maxAge?: number) => Promise<string>;
export declare function generateCsrfToken(secret: string, maxAge?: number): Promise<string>;
export declare const verifyToken: (token: string, secret: string) => Promise<JWT>;
export type ResponseProvider = {
    id: string;
    name: string;
    type: string;
    callbackUrl: string;
    signInUrl: string;
};
export declare function getProviders(options: AuthOptions): Promise<ResponseProvider[]>;
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
};
export declare const tokenCallback: ({ options, token, updates, trigger, user, auth, }: TokenCallbackProps) => Promise<any>;
type providerParams = {
    options: AuthOptions;
    provider: string;
    credentials?: Record<string, string>;
};
export type ProviderResp = {
    user: User | null;
    auth: Auth;
};
export declare function callProvider({ options, provider, credentials, }: providerParams): Promise<ProviderResp>;
export {};
