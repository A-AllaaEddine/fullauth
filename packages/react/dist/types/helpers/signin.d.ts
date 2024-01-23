import { Session } from '@fullauth/core';
export type SigninResp = {
    ok: boolean;
    error: string;
} | {
    ok: boolean;
    session: Session;
} | null;
declare const signIn: <P extends string>(provider: "credentials" | P | "google" | "github", credentials?: Record<string, string>) => Promise<SigninResp>;
export default signIn;
