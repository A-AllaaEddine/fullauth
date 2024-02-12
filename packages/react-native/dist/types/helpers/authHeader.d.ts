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
export declare const authHeaders: () => Promise<AuthHeaders>;
