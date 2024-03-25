import AsyncStorage from '@react-native-async-storage/async-storage';
import { authHeaders } from './authHeader';

/**
 * Destory user session.
 *
 * @param {string} baseUrl -The url for your fullauth backend.
 */

const signOut = async ({ baseUrl }: { baseUrl: string }) => {
  try {
    const resp = await fetch(
      `${
        baseUrl ??
        process.env.EXPO_PUBLIC_FULLAUTH_URL ??
        'http://localhost:3000'
      }/api/auth/signout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(await authHeaders()),
        },
        body: JSON.stringify({}),
      }
    );
    if (!resp.ok) {
      throw new Error('Internal Server Error');
    }

    await AsyncStorage.removeItem('fullauth-session-token');
    await AsyncStorage.removeItem('fullauth-session-csrf-token');
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

export default signOut;
