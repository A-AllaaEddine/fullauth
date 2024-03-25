export const getProviders = async ({ baseUrl }: { baseUrl?: string }) => {
  const providersResp = await fetch(
    `${
      baseUrl ?? process.env.EXPO_PUBLIC_FULLAUTH_URL ?? 'http://localhost:3000'
    }/api/auth/mobile/providers`,
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
