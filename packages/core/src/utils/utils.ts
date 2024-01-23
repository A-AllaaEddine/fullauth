import * as jwt from 'jsonwebtoken';
import { Auth, AuthOptions, DbData, JWT, User } from '../types/types';

export async function getBodyData(
  req: Request
): Promise<Record<string, any> | undefined> {
  if (!('body' in req) || !req.body || req.method !== 'POST') return;
  const contentType = req.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return await req.json();
  } else if (contentType?.includes('application/x-www-form-urlencoded')) {
    const params = new URLSearchParams(await req.text());
    return Object.fromEntries(params);
  }
}

export const generateToken = async (
  payload: Partial<DbData> | Partial<JWT> | Record<string, string>,
  secret: string,
  maxAge?: number
) => {
  if ('expiresAt' in payload && payload.expiresAt) {
    return jwt.sign(payload, secret ?? 'cIdaCk3VCRQgIMCX62KI7weqX2SrgDLE');
  }
  if ('exp' in payload && payload.exp) {
    return jwt.sign(payload, secret ?? 'cIdaCk3VCRQgIMCX62KI7weqX2SrgDLE');
  }

  return jwt.sign(payload, secret! ?? 'cIdaCk3VCRQgIMCX62KI7weqX2SrgDLE', {
    expiresIn: maxAge ?? 60 * 60 * 24 * 7,
  });
};

export async function generateCsrfToken(secret: string, maxAge?: number) {
  return await jwt.sign({}, secret ?? 'cIdaCk3VCRQgIMCX62KI7weqX2SrgDLE', {
    expiresIn: maxAge ?? 60 * 60 * 24 * 7,
  });
  // return await generateToken({}, secret!, maxAge ?? 60);
}

export const verifyToken = async (token: string, secret: string) => {
  try {
    return jwt.verify(
      token,
      secret! ?? 'cIdaCk3VCRQgIMCX62KI7weqX2SrgDLE'
    ) as JWT;
  } catch (error: any) {
    throw error;
  }
};

export type ResponseProvider = {
  id: string;
  name: string;
  type: string;
  callbackUrl: string;
  signInUrl: string;
};
export async function getProviders(options: AuthOptions) {
  const url =
    process.env.NEXT_PUBLIC_LAZYAUTH_URL ??
    process.env.EXPO_PUBLIC_LAZYAUTH_URL ??
    'http://localhost:3000';

  const providers: ResponseProvider[] = options.providers.reduce(
    (acc: any, provider) => {
      acc[provider.id] = {
        id: provider.id,
        name: provider.name,
        type: provider.type,
        callbackUrl: `${url}/api/auth/callback/${provider.id?.toLowerCase()}`,
        signInUrl: `${url}/api/auth/signin/${provider.id?.toLowerCase()}`,
      };
      return acc;
    },
    {}
  );

  return providers;
}

export type DatabaseCallbackProps = {
  options: AuthOptions;
  updates: any;
  data: DbData;
  trigger: 'signin' | 'update' | undefined;
  auth: Auth | null;
  user: User | null;
};
export const databaseCallback = async ({
  options,
  updates,
  data,
  trigger,
  auth,
  user,
}: DatabaseCallbackProps) => {
  const newSession: DbData =
    (options.callbacks?.database &&
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

export type TokenCallbackProps = {
  options: AuthOptions;
  token: JWT | null;
  updates: any;
  trigger: 'signin' | 'update' | undefined;
  user: User | null;
  auth: Auth | null;
};
export const tokenCallback = async ({
  options,
  token,
  updates,
  trigger,
  user,
  auth,
}: TokenCallbackProps): Promise<any> => {
  const newJwt =
    (options.callbacks?.token &&
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

type providerParams = {
  options: AuthOptions;
  provider: string;
  credentials?: Record<string, string>;
};

export type ProviderResp = {
  user: User | null;
  auth: Auth;
};
export async function callProvider({
  options,
  provider,
  credentials,
}: providerParams): Promise<ProviderResp> {
  const selectedProvider = options.providers.find(
    (prov: any) => prov.id === provider
  );

  let user: User | null = null;
  let auth: Auth | null = {
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
    } catch (error: any) {
      console.log('Provider: ', error);
      throw error;
    }
  }

  return { user, auth };
}
