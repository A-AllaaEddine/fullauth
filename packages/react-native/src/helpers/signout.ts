import AsyncStorage from '@react-native-async-storage/async-storage';

export type SignOutResp =
  | {
      ok: boolean;
      error: string;
    }
  | undefined;

const signOut = async (): Promise<SignOutResp> => {
  try {
    const resp = await fetch(
      `${
        process.env.EXPO_PUBLIC_LAZYAUTH_URL ?? 'http://localhost:3000'
      }/api/auth/signout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isMobile: false }),
      }
    );
    if (!resp.ok) {
      return {
        ok: false,
        error: 'Internal Server Error',
      };
    }

    await AsyncStorage.removeItem('lazyauth-session-token');
    await AsyncStorage.removeItem('lazyauth-session-csrf-token');
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

export default signOut;
