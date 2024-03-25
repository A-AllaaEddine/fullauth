/**
 * Destory user session.
 *
 * @param {string} baseUrl -The url for your fullauth backend.
 */
declare const signOut: ({ baseUrl }: {
    baseUrl: string;
}) => Promise<void>;
export default signOut;
