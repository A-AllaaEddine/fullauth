// import { JWT } from '../..';
import { Session } from '@fullauth/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

/**
 * Authenticates a user based on the selected provider.
 *
 * @param {string} provider -The id of the provider.
 * @param {string} credentials - The credentials for the provider (only for credentials provider).
 * @returns {Promise<SigninResp>} A promise that returns session object on success.
 * @throws {AuthenticationError} If authentication fails, return error object.
 */

const signIn = async <P extends string>(
  provider: 'credentials' | 'google' | 'github' | P,
  credentials?: Record<string, string>
): Promise<SigninResp> => {
  try {
    const providersResp = await fetch(
      `${
        process.env.EXPO_PUBLIC_FULLAUTH_URL ?? 'http://localhost:3000'
      }/api/auth/providers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider, credentials, isMobile: false }),
      }
    );

    if (!providersResp.ok) {
      return {
        ok: false,
        error: 'Internal Server Error',
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
      process.env.EXPO_PUBLIC_FULLAUTH_URL ?? 'http://localhost:3000'
    }/
      ${isCredentials ? 'callback' : 'signin'}/${provider}`;

    const token = await AsyncStorage.getItem('fullauth-session-token');
    const csrfToken = await AsyncStorage.getItem('fullauth-session-csrf-token');

    const signInResp = await fetch(
      isCredentials
        ? providers[provider].signInUrl
        : providers[provider].callbackUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          credentials,
          isMobile: true,
          token: token,
          csrfToken: csrfToken,
        }),
      }
    );

    const data: {
      ok: boolean;
      message: string;
      token: string;
      csrfToken: string;
      session: Session;
    } = await signInResp.json();
    if (!data.ok) {
      if (data.message === 'Session already exist') {
        return null;
      }
      if (data.message === 'jwt expired') {
        await AsyncStorage.removeItem('fullauth-session-token');
        throw new Error('Session expired.');
      }
      throw new Error(data.message);
    }
    await AsyncStorage.setItem('fullauth-session-token', data.token);
    await AsyncStorage.setItem('fullauth-session-csrf-token', data.csrfToken);

    return { ok: true, session: data.session };
  } catch (error: any) {
    // console.log(error);
    throw error;
  }
};

export default signIn;
