export type AuthHeaders = {
    token: string;
    csrfToken: string;
};
declare const authHeaders: () => Promise<AuthHeaders>;
export default authHeaders;
