import { Session } from '@fullauth/core';
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
declare const signIn: <P extends string>(provider: "credentials" | P | "google" | "github", credentials?: Record<string, string>) => Promise<SigninResp>;
export default signIn;
