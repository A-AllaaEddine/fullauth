import { AuthOptions, JWT, Session } from '@fullauth/core';
import { verifyToken } from '@fullauth/core/utils';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const getSession = async (
  options: AuthOptions,
  req?: Request | NextRequest
) => {
  try {
    let token: JWT | null = null;

    // with request (to support mobile apps)
    if (req) {
      // check for token in headers
      const headers = req.headers;
      const sessionToken = headers.get('token');

      // case 1: there is token in headers: use that token to get session data
      if (sessionToken) {
        console.log('case 1');
        const csrfToken = headers.get('csrfToken');
        // check for csrf token
        if (!csrfToken) {
          console.log('Invalid csrf token');
          return null;
        }

        token = await verifyToken(sessionToken, options?.secret!);

        if (!token) {
          console.log('Invalid JWT');
          return null;
        }
        if (token.csrfToken !== csrfToken) {
          console.log('Invalid csrf token');
          return null;
        }

        const exp = token?.exp;
        delete token.csrfToken;
        delete token.exp;
        delete token.iat;

        const session: Session = {
          ...token,
          expiresAt: exp,
        };

        // return session object
        return session;
      }
      console.log('case 1');
      // case 2: there is no token in headers: check cookies
      const cookie = cookies().get('fullauth-session-token');
      const csrfCookie = cookies().get('fullauth-session-csrf-token');

      if (!cookie?.value) {
        console.log('Invalid cookie');
        return null;
      }
      if (!csrfCookie?.value) {
        console.log('Invalid crsf cookie');
        return null;
      }

      token = await verifyToken(cookie?.value!, options?.secret!);
      if (!token) {
        console.log('Invalid token');
        return null;
      }

      if (token.csrfToken !== csrfCookie?.value) {
        console.log('Invalid csrf token');
        return null;
      }

      const exp = token?.exp;
      delete token.csrfToken;
      delete token.exp;
      delete token.iat;

      const session: Session = {
        ...token,
        expiresAt: exp,
      };
      return session;
    }

    const cookie = cookies().get('fullauth-session-token');
    const csrfCookie = cookies().get('fullauth-session-csrf-token');

    if (!cookie?.value) {
      console.log('Invalid cookie');
      return null;
    }
    if (!csrfCookie?.value) {
      console.log('Invalid crsf cookie');
      return null;
    }

    token = await verifyToken(cookie?.value!, options?.secret!);
    if (!token) {
      console.log('Invalid token');
      return null;
    }

    if (token.csrfToken !== csrfCookie?.value) {
      console.log('Invalid csrf token');
      return null;
    }

    const exp = token?.exp;
    delete token.csrfToken;
    delete token.exp;
    delete token.iat;

    const session: Session = {
      ...token,
      expiresAt: exp,
    };
    return session;

    // Default behaviour
  } catch (error: any) {
    // console.log(error);
    if (error.message === 'jwt expired') {
      return null;
    }
    throw error;
  }
};

function getServerSession(options: AuthOptions): any;

function getServerSession(
  req: Request | NextRequest,
  options: AuthOptions
): any;

async function getServerSession(
  ...args: [AuthOptions] | [Request | NextRequest, AuthOptions]
) {
  // no request ex: server component
  if (args.length === 1) {
    const options = args[0];

    return getSession(options);
  }

  // with request object
  const req = args[0];
  const options = args[1];

  return getSession(options, req);
}

export default getServerSession;
