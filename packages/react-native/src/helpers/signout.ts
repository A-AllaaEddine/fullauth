import AsyncStorage from '@react-native-async-storage/async-storage';
import { authHeaders } from './authHeader';

const signOut = async () => {
  try {
    const resp = await fetch(
      `${
        process.env.EXPO_PUBLIC_FULLAUTH_URL ?? 'http://localhost:3000'
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
