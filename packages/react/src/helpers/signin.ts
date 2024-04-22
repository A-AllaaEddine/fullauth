'use client';

import { Session } from '@fullauth/core';
import { getProviders } from '../utils/utils';

export type SigninResp = {
  session: Session | null;
} | null;

/**
 * Authenticates a user based on the selected provider.
 *
 * @param {string} provider -The id of the provider.
 * @param {string} credentials - The credentials for the provider (only for credentials provider).
 * @param {boolean} redirect - Redirect to specific url after signing in (default to true).
 * @param {string} redirectUrl - The url to redirect to after signing in (only provide it when redirect is set to true).
 * @returns {Promise<SigninResp>} A promise that returns session object on success.
 * @throws {AuthenticationError} If authentication fails, return error object.
 */

const signIn = async <P extends string>(
  provider: 'credentials' | 'google' | 'github' | P,
  options?: {
    credentials?: Record<string, string>;
    redirect?: boolean;
    redirectUrl?: string;
  }
): Promise<SigninResp> => {
  try {
    const {
      credentials,
      redirect = true,
      redirectUrl = window.location.href,
    } = options ?? {};
    const providers = await getProviders();

    if (!providers[provider]) {
      throw new Error('Invalid provider');
    }

    const isCredentials = providers[provider].type === 'credentials';

    const signInResp = await fetch(
      isCredentials
        ? providers[provider].callbackUrl
        : providers[provider].signInUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          credentials,
          ...(redirect && { redirectUrl }),
        }),
      }
    );

    const data: {
      ok: boolean;
      message: string;
      session?: Session;
      redirect?: string;
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
  } catch (error: any) {
    // console.log('Sign in: ', error);
    throw error;
  }
};

export default signIn;
