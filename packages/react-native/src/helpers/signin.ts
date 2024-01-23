// import { JWT } from '../..';
import { Session } from '@lazyauth/core';
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

const signIn = async <P extends string>(
  provider: 'credentials' | 'google' | 'github' | P,
  credentials?: Record<string, string>
): Promise<SigninResp> => {
  try {
    const providersResp = await fetch(
      `${
        process.env.EXPO_PUBLIC_LAZYAUTH_URL ?? 'http://localhost:3000'
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

    // const csrfResp = await fetch(
    //   `${
    //     process.env.EXPO_PUBLIC_LAZYAUTH_URL ?? 'http://localhost:3000'
    //   }/api/auth/csrf`,
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ isMobile: true }),
    //   }
    // );

    // if (!csrfResp.ok) {
    //   const data = await csrfResp.json();
    //   return {
    //     ok: csrfResp.ok,
    //     status: csrfResp.status,
    //     error: data.message,
    //   };
    // }

    // const csrfToken = await csrfResp.json();

    const url = `${
      process.env.EXPO_PUBLIC_LAZYAUTH_URL ?? 'http://localhost:3000'
    }/
      ${isCredentials ? 'callback' : 'signin'}/${provider}`;

    const token = await AsyncStorage.getItem('lazyauth-session-token');
    const csrfToken = await AsyncStorage.getItem('lazyauth-session-csrf-token');

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
        await AsyncStorage.removeItem('lazyauth-session-token');
        throw new Error('Session expired.');
      }
      throw new Error(data.message);
    }
    await AsyncStorage.setItem('lazyauth-session-token', data.token);
    await AsyncStorage.setItem('lazyauth-session-csrf-token', data.csrfToken);

    return { ok: true, session: data.session };
  } catch (error: any) {
    // console.log(error);
    throw error;
  }
};

export default signIn;
