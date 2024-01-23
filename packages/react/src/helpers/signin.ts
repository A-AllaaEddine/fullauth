'use client';

import { Session } from '@fullauth/core';

export type SigninResp =
  | {
      ok: boolean;
      error: string;
    }
  | {
      ok: boolean;
      session: Session;
    }
  | null;

const signIn = async <P extends string>(
  provider: 'credentials' | 'google' | 'github' | P,
  credentials?: Record<string, string>
): Promise<SigninResp> => {
  try {
    const providersResp = await fetch(
      `${
        process.env.NEXT_PUBLIC_FULLATH_URL ?? 'http://localhost:3000'
      }/api/auth/providers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider, isMobile: false }),
      }
    );

    if (!providersResp.ok) {
      return {
        ok: false,
        error: 'Error while getting providers',
      };
    }
    const providers: Record<
      string,
      {
        id: string;
        name: string;
        type: string;
        callbackUrl: string;
        signInUrl: string;
      }
    > = await providersResp.json();

    if (!providers[provider]) {
      return {
        ok: false,
        error: 'Invalid provider',
      };
    }

    const isCredentials = providers[provider].type === 'credentials';

    const url = `${
      process.env.NEXT_PUBLIC_FULLAUTH_URL ?? 'http://localhost:3000'
    }/
      ${isCredentials ? 'callback' : 'signin'}/${provider}`;
    const signInResp = await fetch(
      isCredentials
        ? providers[provider].signInUrl
        : providers[provider].callbackUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider, credentials, isMobile: false }),
      }
    );

    const data: {
      ok: boolean;
      message: string;
      session: Session;
    } = await signInResp.json();

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
  } catch (error: any) {
    // console.log('Sign in: ', error);
    throw error;
  }
};

export default signIn;
