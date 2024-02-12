export const getProviders = async () => {
  const providersResp = await fetch(
    `${
      process.env.NEXT_PUBLIC_FULLAUTH_URL ?? 'http://localhost:3000'
    }/api/auth/providers`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!providersResp.ok) {
    throw new Error('Error while getting providers');
  }
  const providers: Record<
    string,
    {
      id: string;
      name: string;
      type: string;
      callbackUrl: string;
      signInUrl: string;
    }
  > = await providersResp.json();

  return providers;
};
