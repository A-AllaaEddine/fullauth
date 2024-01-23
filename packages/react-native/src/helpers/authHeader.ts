import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuthHeaders = {
  token: string;
  csrfToken: string;
};
const authHeaders = async (): Promise<AuthHeaders> => {
  const token = await AsyncStorage.getItem('lazyauth-session-token');
  const csrfToken = await AsyncStorage.getItem('lazyauth-session-csrf-token');
  return { token: token ?? '', csrfToken: csrfToken ?? '' };
};

export default authHeaders;
