import { CredentialsConfig, ProviderType } from '../providers/credentials';

export type CallbackOptions = {
  /**
   * A Callback that runs on first sign in and  every session request.
   * only when using token strategy
   *
   * @param {JWT | null} token -The session jwt.
   * @param {any} udpate - The object sent from update function).
   * @param {'update' | 'signin' | undefined} trigger - The operation trigger.
   * @param {User | null} user - The user object returned from provider.
   * @param {Auth | null} auth - The object containing information about the provider.
   * @returns {Promise<any>} A promise that returns object for the session jwt.
   * @throws {AuthenticationError} If authentication fails, return error object.
   */
  token: ({
    token,
    updates,
    trigger,
    user,
    auth,
  }: {
    token: JWT | null;
    updates: any;
    trigger: 'update' | 'signin' | undefined;
    user: User | null;
    auth: Auth | null;
  }) => Promise<any>;

  database: ({
    updates,
    data,
    trigger,
    user,
    auth,
  }: {
    updates: any;
    data: DbData;
    trigger: 'update' | 'signin' | undefined;
    user: User | null;
    auth: Auth | null;
  }) => Promise<any>;
};

export type Provider = CredentialsConfig;

export type SessionStrategy = 'token' | 'database';
export type SessionOptions = {
  strategy: SessionStrategy;
  maxAge?: number;
  updateAge?: number;
};

export type Auth = {
  providerId?: string | null;
  providerType?: ProviderType | null;
  email?: string | undefined;
};
export type AuthOptions = {
  providers: Provider[];
  secret?: string;
  session?: SessionOptions;
  callbacks?: Partial<CallbackOptions>;
};

export interface DefaultUser {
  id?: string;
  name?: string;
  email?: string;
}

export interface User extends DefaultUser {}

export type Awaitable<T> = T | Promise<T>;

export type DefaultSession = {
  user?: { id?: string; name?: string; email?: string };
  expiresAt: DbData['expiresAt'] | JWT['exp'] | number;
};
export interface Session extends DefaultSession {
  // user: null | Omit<DbData, 'expiresAt'> | Omit<JWT, 'exp' | 'iat'>;
  // expiresAt: DbData['expiresAt'] | JWT['exp'] | number;
}

export interface DefaultDbData {
  id?: string;
  name?: string;
  email?: string;
  expiresAt?: number;
  csrfToken?: string;
}
export interface DbData extends DefaultDbData {}

export interface DefaultJWT {
  user: {
    id?: string;
    name?: string;
    email?: string;
  };
  iat?: number;
  exp?: number;
  csrfToken?: string;
}

export interface JWT extends DefaultJWT {}
