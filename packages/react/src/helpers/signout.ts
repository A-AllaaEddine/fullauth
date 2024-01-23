'use client';

export type SignOutResp =
  | {
      ok: boolean;
      error: string;
    }
  | undefined;

const signOut = async (): Promise<SignOutResp> => {
  try {
    const resp = await fetch(
      `${
        process.env.NEXT_PUBLIC_FULLAUTH_URL ?? 'http://localhost:3000'
      }/api/auth/signout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isMobile: false }),
      }
    );
    if (!resp.ok) {
      return {
        ok: false,
        error: 'Internal Server Error',
      };
    }
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

export default signOut;
