import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuthHeaders = {
  token: string;
  csrfToken: string;
};

/**
 * Function that return session token and csrf token for the headers
 *
 * @returns {string} token -  The session token.
 * @returns {string} csrfToken -  The csrf token.
 */

const authHeaders = async (): Promise<AuthHeaders> => {
  const token = await AsyncStorage.getItem('fullauth-session-token');
  const csrfToken = await AsyncStorage.getItem('fullauth-session-csrf-token');
  return { token: token ?? '', csrfToken: csrfToken ?? '' };
};

export default authHeaders;
