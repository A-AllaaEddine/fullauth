// import { JWT } from '../..';
import { Session } from '@fullauth/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authHeaders } from './authHeader';
import { getProviders } from '../utils/utils';
export type SigninResp = {
  session: Session;
} | null;

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
          ...(await authHeaders()),
        },
        body: JSON.stringify({
          provider,
          credentials,
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
        await AsyncStorage.removeItem('fullauth-session-csrf-token');
        throw new Error('Session expired.');
      }
      throw new Error(data.message);
    }
    await AsyncStorage.setItem('fullauth-session-token', data.token ?? '');
    await AsyncStorage.setItem(
      'fullauth-session-csrf-token',
      data.csrfToken ?? ''
    );

    return { session: data.session };
  } catch (error: any) {
    console.log('signin error: ', error);
    throw error;
  }
};

export default signIn;
