import { Auth, OAuthConfig, OAuthProvider, User } from '../types/types';

export interface GoogleConfig extends OAuthConfig {}

export interface GoogleProvider extends OAuthProvider {}

export function GoogleProvider(options: GoogleConfig): GoogleProvider {
  return {
    id: options.id ?? 'google',
    name: 'google',
    type: 'oauth',
    clientId: options?.clientId,
    clientSecret: options?.clientSecret,
    ProviderSignin,
    ProviderCallback,
  };
}

const ProviderSignin = ({
  isMobile,
  clientId,
  clientSecret,
  redirectUrl,
}: {
  isMobile: boolean;
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
}) => {
  const uri = isMobile
    ? `${process.env.NEXT_PUBLIC_FULLAUTH_URL}/api/auth/callback/mobile/google`
    : `${process.env.NEXT_PUBLIC_FULLAUTH_URL}/api/auth/callback/google`;
  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${uri}&scope=openid%20email%20profile&response_type=code&access_type=offline&state=${encodeURIComponent(
    `${redirectUrl}`
  )}`;

  return { redirectURL: googleUrl };
};

// const ProviderCallback = () => {};

const ProviderCallback = async ({
  code,
  clientId,
  clientSecret,
  isMobile,
}: {
  code: string;
  clientId: string;
  clientSecret: string;
  isMobile: boolean;
}) => {
  try {
    const uri = isMobile
      ? `${process.env.NEXT_PUBLIC_FULLAUTH_URL}/api/auth/callback/mobile/google`
      : `${process.env.NEXT_PUBLIC_FULLAUTH_URL}/api/auth/callback/google`;

    const resp = await fetch(`https://oauth2.googleapis.com/token`, {
      method: 'POST',
      body: JSON.stringify({
        code: code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: uri,
        grant_type: 'authorization_code',
      }),
    });
    const data = await resp.json();

    if (!data) {
      throw new Error('Invalid Server Error');
    }
    const response = await fetch(
      'https://openidconnect.googleapis.com/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      }
    );
    const userData = await response.json();

    if (!userData) {
      throw new Error('Invalid Server Error');
    }
    const user = {
      name: userData?.name,
      email: userData?.email,
      picture: userData?.picture,
    };
    const auth = {
      accessToken: data?.access_token,
      refreshToken: data?.refresh_token,
      accessTokenExpires: data.expires_in,
    };

    return { user, auth };
  } catch (error: any) {
    // console.log('Google Provider: ',error);
    throw new Error(`Google Provider: ${error.message}`);
  }
};
