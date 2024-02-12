'use client';

const signOut = async () => {
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
        body: JSON.stringify({}),
      }
    );
    if (!resp.ok) {
      throw new Error('Internal Server Error');
    }
    window.location.reload();
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

export default signOut;
