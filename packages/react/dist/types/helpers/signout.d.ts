export type SignOutResp = {
    ok: boolean;
    error: string;
} | undefined;
declare const signOut: () => Promise<SignOutResp>;
export default signOut;
