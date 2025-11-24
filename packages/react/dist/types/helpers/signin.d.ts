import { Session } from '@fullauth/core';
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
declare const signIn: <P extends string>(provider: "credentials" | "google" | "github" | P, options?: {
    credentials?: Record<string, string>;
    redirect?: boolean;
    redirectUrl?: string;
}) => Promise<SigninResp>;
export default signIn;
