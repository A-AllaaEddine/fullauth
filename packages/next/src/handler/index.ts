import { NextRequest, NextResponse } from 'next/server';

import { cookies } from 'next/headers';

import {
  callProvider,
  generateCsrfToken,
  generateToken,
  getBodyData,
  getProviders,
  tokenCallback,
  verifyToken,
} from '@fullauth/core/utils';

import { AuthOptions, Session } from '@fullauth/core';

async function NextAppRouteHandler(
  req: NextRequest,
  res: Response,
  options: AuthOptions
) {
  const sessionStrategry = {
    maxAge: 60 * 60 * 24 * 7,
    strategry: 'token',
    ...options.session,
  };
  const method = await req.method;

  if (method === 'POST') {
    const body = await getBodyData(req);

    const params = (res as any).params;

    // return the available providers
    if (params.fullauth.includes('providers')) {
      try {
        const providers = await getProviders(options);
        return NextResponse.json({ ...providers });
      } catch (error: any) {
        console.log('Providers: ', error);
        return NextResponse.json({ ok: false, message: error.message });
      }
    }

    if (params.fullauth.includes('signout')) {
      if ((body as any).isMobile) {
        return NextResponse.json({ ok: true, message: 'Session Deleted.' });
      }
      await cookies().delete('fullauth-session-token');
      await cookies().delete('fullauth-session-csrf-token');
      return NextResponse.json({ ok: true, message: 'Session Deleted.' });
    }

    // if provider is not provided

    if (params.fullauth.includes('callback')) {
      // TODO: add OAuth providers
    }

    if (params.fullauth.includes('signin')) {
      try {
        // no provider
        if (!(body as any).provider) {
          return NextResponse.json({
            ok: false,
            message: 'Provider must be specified',
          });
        }

        // if credentials are not provided when calling credentials provider
        if (!(body as any).credentials) {
          return NextResponse.json({
            ok: false,
            message:
              'Credentials must be valid when using Credentials Provider.',
          });
        }
        if (sessionStrategry?.strategry === 'token') {
          // mobile session exist
          if ((body as any).isMobile) {
            const token = (body as any).token;
            if (token) {
              return Response.json({
                ok: false,
                message: 'Session already exist',
              });
            }
          }

          // web session exist
          const cookie = cookies().get('fullauth-session-token');
          if (cookie?.value) {
            return NextResponse.json({
              ok: false,
              message: 'Session already exist',
            });
          }

          // otherwise create new session

          // call the provider to receive the user
          const { user, auth } = await callProvider({
            options,
            provider: (body as any).provider,
            credentials: (body as any).credentials,
          });

          if (!user) {
            return NextResponse.json({
              ok: false,
              message: 'Internal Server Err',
            });
          }

          const jwt = await tokenCallback({
            options,
            token: null,
            trigger: 'signin',
            updates: null,
            user: user,
            auth,
          });

          // Generate csrf token to storeit in cookie
          const csrfToken = await generateCsrfToken(
            options.secret!,
            options?.session?.maxAge
          );

          // generate token to store in cookie
          const tokenString = await generateToken(
            { ...jwt!, csrfToken: csrfToken },
            options?.secret!,
            options?.session?.maxAge
          );

          // get data from generated token to send to client on first sign in
          const returnJwt = await verifyToken(tokenString, options?.secret!);

          // remove unnecessary fields
          const exp = returnJwt?.exp;
          delete returnJwt.csrfToken;
          delete returnJwt.iat;
          delete returnJwt.exp;

          // generate the session that gets returned to the client
          const session: Session = {
            // user: returnJwt.user,
            ...returnJwt,
            expiresAt: exp ?? options?.session?.maxAge! ?? 60 * 60 * 24 * 7,
          };

          // For Mobile
          if ((body as any).isMobile) {
            return Response.json({
              ok: true,
              message: 'Session created.',
              token: tokenString,
              csrfToken: csrfToken,
              session: session,
            });
          }

          // For Web
          const response = NextResponse.json({
            ok: true,
            message: 'Session created.',
            session: session,
          });
          // setting the cookie
          response.cookies.set({
            name: 'fullauth-session-token',
            value: tokenString,
            httpOnly: true,
            maxAge: sessionStrategry?.maxAge ?? 60 * 60 * 24 * 7,
            secure: process.env.NODE_ENV === 'development' ? false : true,
            sameSite: process.env.NODE_ENV === 'development' ? false : true,
          });

          response.cookies.set({
            name: 'fullauth-session-csrf-token',
            value: csrfToken,
            httpOnly: true,
            maxAge: sessionStrategry?.maxAge ?? 60 * 60 * 24 * 7,
            secure: process.env.NODE_ENV === 'development' ? false : true,
            sameSite: process.env.NODE_ENV === 'development' ? false : true,
          });
          return response;
        }
      } catch (error: any) {
        console.log('Next Handler: ', error);
        return NextResponse.json({ ok: false, message: error.message });
      }
    }

    if (params.fullauth.includes('update')) {
      // Mobile
      if (sessionStrategry?.strategry === 'token') {
        if ((body as any).isMobile) {
          const jwt = await verifyToken((body as any).token!, options?.secret!);

          if (!(body as any).csrfToken) {
            return NextResponse.json({
              ok: false,
              message: 'Invalid CSRF Token',
            });
          }

          if (jwt.csrfToken !== (body as any).csrfToken) {
            NextResponse.json({
              ok: false,
              message: 'Invalid CSRF Token',
            });
          }

          const token = await tokenCallback({
            options,
            token: jwt,
            trigger: 'update',
            updates: (body as any).data,
            user: null,
            auth: null,
          });
          const sessionJwt = await generateToken(token, options?.secret!);
          return NextResponse.json({ token: sessionJwt });
        }
        // verify the csrf token
        const csrfCookie = await cookies().get('fullauth-session-csrf-token');
        if (!csrfCookie) {
          return NextResponse.json({
            ok: false,
            message: 'Invalid CSRF Token',
          });
        }

        // await verifyToken(csrfCookie.value!, options?.secret!);

        // get the session cookie
        const cookie = await cookies().get('fullauth-session-token');

        if (!cookie) {
          return NextResponse.json({
            ok: false,
            message: 'Invalid Session Token',
          });
        }

        const data = body as any;
        // get session data from cookie
        const cookieData = await verifyToken(cookie.value!, options?.secret!);

        // check if csrfToken from cookie match the one in the session token
        if (cookieData.csrfToken !== csrfCookie.value) {
          NextResponse.json({
            ok: false,
            message: 'Invalid CSRF Token',
          });
        }
        const token = await tokenCallback({
          options,
          token: cookieData,
          trigger: 'update',
          updates: data,
          user: null,
          auth: null,
        });
        // const newSessionData = DeepMerge(token, data as JWT);

        // geenrate  new session jwt
        const sessionJwt = await generateToken(token, options?.secret!);
        // set new cookie
        const response = NextResponse.json({
          ok: true,
          message: 'Session updated.',
        });

        response.cookies.set({
          name: 'fullauth-session-token',
          value: sessionJwt,
          httpOnly: true,
          maxAge:
            cookieData.exp! - Math.floor(Date.now() / 1000) ?? 60 * 60 * 24 * 7,
          secure: process.env.NODE_ENV === 'development' ? false : true,
          sameSite: process.env.NODE_ENV === 'development' ? false : true,
        });

        return response;
      }
    }

    if (params.fullauth.includes('session')) {
      if (sessionStrategry?.strategry === 'token') {
        // mobile
        if ((body as any).isMobile) {
          if (!(body as any).token) {
            return NextResponse.json({
              message: 'No Session',
            });
          }

          try {
            const token = await verifyToken(
              (body as any).token,
              options?.secret!
            );

            const jwt = await tokenCallback({
              options,
              token: token,
              trigger: undefined,
              updates: null,
              user: null,
              auth: null,
            });

            const exp = jwt?.exp;
            delete jwt.csrfToken;
            delete jwt.exp;
            delete jwt.iat;
            return NextResponse.json({
              session: {
                ...jwt,
                expiresAt: exp,
              },
            });
          } catch (error: any) {
            console.log(error);
            return NextResponse.json({ message: error.message });
          }
        }

        const cookie = cookies().get('fullauth-session-token');

        if (!cookie) {
          const response = NextResponse.json({
            message: 'No Session',
          });
          response.cookies.delete('fullauth-session-token');
          return response;
        }

        // await verifyCsrfToken(cookie.value, options.secret!);

        if (!cookie.value)
          return NextResponse.json({ message: 'Invalid Cookie' });

        try {
          const decoded = await verifyToken(cookie.value!, options.secret!);

          const jwt = await tokenCallback({
            options,
            token: decoded,
            trigger: undefined,
            updates: null,
            user: null,
            auth: null,
          });
          const exp = jwt?.exp;
          delete jwt.csrfToken;
          delete jwt.exp;
          delete jwt.iat;
          return NextResponse.json({
            session: {
              ...jwt,
              expiresAt: exp,
            },
          });
        } catch (error: any) {
          console.log(error);
          const response = NextResponse.json({
            error: error.message,
          });
          response.cookies.delete('fullauth-session-token');
          return response;
        }
      }
    }

    if (params.fullauth.includes('csrf')) {
      // Generate csrf token
      const csrfToken = await generateToken({}, options.secret!);

      if ((body as any).isMobile) {
        return NextResponse.json({ token: csrfToken });
      }
      const response = NextResponse.json({
        message: 'Csrf Token generated.',
      });

      response.cookies.set({
        name: 'fullauth-session-csrf-token',
        value: csrfToken,
        httpOnly: true,
        maxAge: undefined,
        secure: process.env.NODE_ENV === 'development' ? false : true,
        sameSite: process.env.NODE_ENV === 'development' ? false : true,
      });

      return response;
    }
  }

  if (method === 'GET') {
    const params = (res as any).params;
  }
  return NextResponse.json({ message: 'Method Unauthorised' });
}

function NextHandler(options: AuthOptions): any;

function NextHandler(
  req: NextRequest,
  res: Response,
  options: AuthOptions
): any;

// main function
function NextHandler(
  ...args: [AuthOptions] | Parameters<typeof NextAppRouteHandler>
) {
  // | Parameters<typeof NextAuthApiHandler>
  if (args.length === 1) {
    return async (req: NextRequest, res: Response) => {
      if ((res as any)?.params) {
        return await NextAppRouteHandler(req, res, args[0]);
      }
    };
  }
}

export default NextHandler;
