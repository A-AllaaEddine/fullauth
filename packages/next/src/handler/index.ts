import { NextRequest, NextResponse } from 'next/server';

import { cookies, headers } from 'next/headers';

import {
  ProviderCallback,
  ProviderSignin,
  generateCsrfToken,
  generateToken,
  getBodyData,
  getProviders,
  tokenCallback,
  verifyToken,
} from '@fullauth/core/utils';

import { AuthOptions, JWT, Session } from '@fullauth/core';
import { redirect } from 'next/navigation';
import { redirectCallback } from '@fullauth/core/utils';

async function NextAppRouteHandler(
  req: NextRequest,
  res: Response,
  options: AuthOptions
) {
  const sessionStrategry = {
    maxAge: 60 * 60 * 24 * 7,
    strategy: 'token',
    ...options.session,
  };
  const method = await req.method;

  if (method === 'POST') {
    const body = await getBodyData(req);

    const params: {
      fullauth: string[];
    } = (res as any).params;

    if (params.fullauth.includes('signout')) {
      const isMobile = params.fullauth.includes('mobile');
      if (isMobile) {
        return NextResponse.json({ ok: true, message: 'Session Deleted.' });
      }
      cookies().delete('fullauth-session-token');
      cookies().delete('fullauth-session-csrf-token');
      return NextResponse.json({ ok: true, message: 'Session Deleted.' });
    }

    if (params.fullauth.includes('signin')) {
      // DOING: add OAuth providers
      const isMobile = params.fullauth.includes('mobile');
      const redirectUrl = (body as any).redirectUrl;
      try {
        // no provider
        if (!(body as any).provider) {
          return NextResponse.json({
            ok: false,
            message: 'Provider must be specified',
          });
        }

        if (sessionStrategry?.strategy === 'token') {
          // mobile session exist
          if (isMobile) {
            const head = headers();
            const sessionTtoken = head.get('token');
            if (sessionTtoken) {
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
          const { redirectURL } = await ProviderSignin({
            options,
            provider: (body as any).provider,
            isMobile,
            redirectUrl,
          });

          if (!redirect) {
            return NextResponse.json({
              ok: false,
              message: 'Internal Server Error',
            });
          }

          if (!redirectURL) {
            throw new Error('Invalid Google Redirect Url');
          }
          // return Response.redirect(redirectURL);
          return NextResponse.json({ ok: true, redirect: redirectURL });
        }
      } catch (error: any) {
        console.log('Next Handler: ', error);
        return NextResponse.json({ ok: false, message: error.message });
      }
    }

    if (params.fullauth.includes('update')) {
      const isMobile = params.fullauth.includes('mobile');
      if (sessionStrategry?.strategy === 'token') {
        // Mobile
        if (isMobile) {
          const head = headers();
          const sessionTtoken = head.get('token');
          const csrfToken = head.get('csrftoken');

          if (!sessionTtoken) {
            return NextResponse.json({
              ok: false,
              message: 'Invalid Session Token',
            });
          }
          if (!csrfToken) {
            return NextResponse.json({
              ok: false,
              message: 'Invalid CSRF Token',
            });
          }

          const jwt = await verifyToken(sessionTtoken, options?.secret!);
          if (jwt.payload.csrfToken !== csrfToken) {
            NextResponse.json({
              ok: false,
              message: 'Invalid CSRF Token',
            });
          }

          const token = await tokenCallback({
            options,
            token: jwt.payload as unknown as JWT,
            trigger: 'update',
            updates: (body as any).data,
            user: null,
            auth: null,
            isMobile,
          });

          const sessionJwt = await generateToken(token ?? {}, options?.secret!);
          return NextResponse.json({ token: sessionJwt });
        }
        // verify the csrf token
        const csrfCookie = await cookies().get('fullauth-session-csrf-token');
        if (!csrfCookie?.value) {
          return NextResponse.json({
            ok: false,
            message: 'Invalid CSRF Token',
          });
        }

        // await verifyToken(csrfCookie.value!, options?.secret!);

        // get the session cookie
        const cookie = await cookies().get('fullauth-session-token');

        if (!cookie?.value) {
          return NextResponse.json({
            ok: false,
            message: 'Invalid Session Token',
          });
        }

        const data = body as any;

        // get session data from cookie
        const cookieData = await verifyToken(cookie.value!, options?.secret!);

        // check if csrfToken from cookie match the one in the session token
        if (cookieData.payload.csrfToken !== csrfCookie.value) {
          NextResponse.json({
            ok: false,
            message: 'Invalid CSRF Token',
          });
        }

        const token = await tokenCallback({
          options,
          token: cookieData.payload as unknown as JWT,
          trigger: 'update',
          updates: data,
          user: null,
          auth: null,
          isMobile,
        });
        // const newSessionData = DeepMerge(token, data as JWT);

        // geenrate  new session jwt
        const sessionJwt = await generateToken(token ?? {}, options?.secret!);
        // set new cookie
        cookies().set({
          name: 'fullauth-session-token',
          value: sessionJwt,
          httpOnly: true,
          maxAge:
            cookieData.payload.exp! - Math.floor(Date.now() / 1000) ??
            60 * 60 * 24 * 7,
          secure: process.env.NODE_ENV === 'development' ? false : true,
          sameSite: process.env.NODE_ENV === 'development' ? false : true,
        });
        return NextResponse.json({
          ok: true,
          message: 'Session updated.',
        });
      }
    }

    if (params.fullauth.includes('callback')) {
      try {
        const isMobile = params.fullauth.includes('mobile');
        const provider = isMobile ? params.fullauth[2] : params.fullauth[1];
        const redirectUrl = (body as any).redirectUrl;

        const { user, auth } = await ProviderCallback({
          options,
          provider: provider,
          credentials: (body as any).credentials,
          isMobile,
        });

        if (!user) {
          return NextResponse.json({
            ok: false,
            message: 'Internal Server Error',
          });
        }

        const jwt = await tokenCallback({
          options,
          token: null,
          trigger: 'signin',
          updates: null,
          user,
          auth,
          isMobile,
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
        const exp = returnJwt?.payload.exp;
        // delete returnJwt.payload.csrfToken;
        // delete returnJwt.payload.iat;
        // delete returnJwt.payload.exp;

        // generate the session that gets returned to the client
        const session: Session = {
          ...returnJwt,
          expiresAt: exp ?? options?.session?.maxAge! ?? 60 * 60 * 24 * 7,
        };

        // For Mobile
        if (isMobile) {
          return Response.json({
            ok: true,
            message: 'Session created.',
            token: tokenString,
            csrfToken: csrfToken,
            session: session,
          });
        }

        // For Web

        cookies().set({
          name: 'fullauth-session-token',
          value: tokenString,
          httpOnly: true,
          maxAge: sessionStrategry?.maxAge ?? 60 * 60 * 24 * 7,
          secure: process.env.NODE_ENV === 'development' ? false : true,
          sameSite: process.env.NODE_ENV === 'development' ? false : true,
        });
        cookies().set({
          name: 'fullauth-session-csrf-token',
          value: csrfToken,
          httpOnly: true,
          maxAge: sessionStrategry?.maxAge ?? 60 * 60 * 24 * 7,
          secure: process.env.NODE_ENV === 'development' ? false : true,
          sameSite: process.env.NODE_ENV === 'development' ? false : true,
        });

        const { url } = redirectCallback(redirectUrl);
        return Response.json({
          ok: true,
          message: 'Session created.',
          redirect: url,
        });
      } catch (error: any) {
        console.log(error);
        return NextResponse.json({ ok: false, message: error.message });
      }
    }
  }

  if (method === 'GET') {
    const params: {
      fullauth: string[];
    } = (res as any).params;

    // return the available providers
    if (params.fullauth.includes('providers')) {
      try {
        const isMobile = params.fullauth.includes('mobile');
        const providers = await getProviders(options, isMobile);
        return NextResponse.json({ ...providers });
      } catch (error: any) {
        console.log('Providers: ', error);
        return NextResponse.json({ ok: false, message: error.message });
      }
    }

    if (params.fullauth.includes('callback')) {
      try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get('code');
        const isMobile = params.fullauth.includes('mobile');
        const provider = isMobile ? params.fullauth[2] : params.fullauth[1];
        const state = searchParams.get('state');
        let redirectUrl = '';
        if (state) redirectUrl = decodeURIComponent(state);

        const { user, auth } = await ProviderCallback({
          options,
          provider: provider,
          code: code ?? '',
          isMobile,
        });

        if (!user) {
          return NextResponse.json({
            ok: false,
            message: 'Internal Server Error',
          });
        }

        const jwt = await tokenCallback({
          options,
          token: null,
          trigger: 'signin',
          updates: null,
          user,
          auth,
          isMobile,
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
        const exp = returnJwt?.payload.exp;
        // delete returnJwt.csrfToken;
        // delete returnJwt.iat;
        // delete returnJwt.exp;

        // generate the session that gets returned to the client
        const session: Session = {
          // user: returnJwt.user,
          ...returnJwt,
          expiresAt: exp ?? options?.session?.maxAge! ?? 60 * 60 * 24 * 7,
        };

        // For Mobile
        if (isMobile) {
          return Response.json({
            ok: true,
            message: 'Session created.',
            token: tokenString,
            csrfToken: csrfToken,
            session: session,
          });
        }

        // For Web

        cookies().set({
          name: 'fullauth-session-token',
          value: tokenString,
          httpOnly: true,
          maxAge: sessionStrategry?.maxAge ?? 60 * 60 * 24 * 7,
          secure: process.env.NODE_ENV === 'development' ? false : true,
          sameSite: process.env.NODE_ENV === 'development' ? false : true,
        });
        cookies().set({
          name: 'fullauth-session-csrf-token',
          value: csrfToken,
          httpOnly: true,
          maxAge: sessionStrategry?.maxAge ?? 60 * 60 * 24 * 7,
          secure: process.env.NODE_ENV === 'development' ? false : true,
          sameSite: process.env.NODE_ENV === 'development' ? false : true,
        });

        const { url } = redirectCallback(redirectUrl);

        return Response.redirect(
          url ?? `${process.env.NEXT_PUBLIC_FULLAUTH_URL}`
        );
      } catch (error: any) {
        console.log(error);
        return NextResponse.json({ ok: false, message: error.message });
      }
    }

    if (params.fullauth.includes('session')) {
      const isMobile = params.fullauth.includes('mobile');

      if (sessionStrategry?.strategy === 'token') {
        // mobile
        if (isMobile) {
          const head = headers();
          const sessionTtoken = head.get('token');
          if (!sessionTtoken) {
            return NextResponse.json({
              message: 'No Session',
            });
          }

          try {
            const token = await verifyToken(sessionTtoken, options?.secret!);

            const jwt = await tokenCallback({
              options,
              token: token.payload as unknown as JWT,
              trigger: undefined,
              updates: null,
              user: null,
              auth: null,
              isMobile,
            });

            const exp = jwt?.exp;
            // delete jwt.csrfToken;
            // delete jwt.exp;
            // delete jwt.iat;
            return NextResponse.json({
              session: {
                ...jwt,
                expiresAt: exp,
              } as Session,
            });
          } catch (error: any) {
            console.log(error);
            return NextResponse.json({
              ok: false,
              error: error.message,
              message: 'Session Deleted.',
            });
          }
        }

        const cookie = cookies().get('fullauth-session-token');

        if (!cookie) {
          cookies().delete('fullauth-session-token');
          return NextResponse.json({
            message: 'No Session',
          });
        }

        if (!cookie.value)
          return NextResponse.json({ message: 'Invalid Cookie' });

        try {
          const decoded = await verifyToken(cookie.value!, options.secret!);

          const jwt = await tokenCallback({
            options,
            token: decoded.payload as unknown as JWT,
            trigger: undefined,
            updates: null,
            user: null,
            auth: null,
            isMobile,
          });

          const exp = jwt?.exp;
          // delete jwt.csrfToken;
          // delete jwt.exp;
          // delete jwt.iat;
          return NextResponse.json({
            session: {
              ...jwt,
              expiresAt: exp,
            } as Session,
          });
        } catch (error: any) {
          console.log(error);
          cookies().delete('fullauth-session-token');
          cookies().delete('fullauth-session-csrf-token');
          return NextResponse.json({
            error: error.message,
            message: 'Session Deleted.',
          });
        }
      }
    }
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
