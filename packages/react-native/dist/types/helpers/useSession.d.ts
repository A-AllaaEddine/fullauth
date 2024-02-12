/**
 * React hook that return session object, update fucntion and auth status
 *
 * @returns {session} The session object.
 * @returns {status} The authentication status.
 * @returns {update} Fucntion to update the session object.
 * @throws {AuthenticationError} If error occurs, return error object.
 */
declare const useSession: () => {
    status: string;
    session: import("@fullauth/core").Session | null;
    update: (data?: any) => Promise<import("./context").Update>;
};
export default useSession;
