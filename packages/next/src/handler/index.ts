import { NextRequest, NextResponse } from "next/server";

import { cookies, headers } from "next/headers";

import {
  ProviderCallback,
  ProviderSignin,
  generateCsrfToken,
  generateToken,
  getBodyData,
  getProviders,
  returnAppropriateError,
  tokenCallback,
  verifyToken,
  redirectCallback,
} from "@fullauth/core/utils";
import {
  CsrfTokenError,
  InternaError,
  InvalidProviderError,
  OAuthRedirectError,
  SessionTokenError,
} from "@fullauth/core";

import { AuthOptions, JWT, Session } from "@fullauth/core";
import { redirect } from "next/navigation";

type AppRouteHandlerRoutes = "/api/auth/[...fullauth]";
interface ParamMap {
  "/": {};
  "/api/auth/[...fullauth]": { fullauth: string[] };
  "/server": {};
}
interface RouteContext<AppRouteHandlerRoute extends AppRouteHandlerRoutes> {
  params: Promise<ParamMap[AppRouteHandlerRoute]>;
}

async function NextAppRouteHandler(
  req: NextRequest,
  ctx: RouteContext<"/api/auth/[...fullauth]">,
  options: AuthOptions
) {
  const sessionStrategry = {
    maxAge: 60 * 60 * 24 * 7,
    strategy: "token",
    ...options.session,
  };
  const method = await req.method;

  if (method === "POST") {
    const body = await getBodyData(req);
    const params: {
      fullauth: string[];
    } = await ctx.params;

    if (params.fullauth.includes("signout")) {
      const isMobile = params.fullauth.includes("mobile");
      if (isMobile) {
        return NextResponse.json({ ok: true, message: "Session Deleted." });
      }
      (await cookies()).delete("fullauth-session-token");
      (await cookies()).delete("fullauth-session-csrf-token");
      return NextResponse.json({ ok: true, message: "Session Deleted." });
    }

    if (params.fullauth.includes("signin")) {
      // DOING: add OAuth providers
      const isMobile = params.fullauth.includes("mobile");
      const redirectUrl = (body as any).redirectUrl;
      try {
        // no provider
        if (!(body as any).provider) {
          throw new InvalidProviderError();
        }

        if (sessionStrategry?.strategy === "token") {
          // mobile session exist
          if (isMobile) {
            const head = await headers();
            const sessionTtoken = head.get("token");
            if (sessionTtoken) {
              return Response.json({
                ok: false,
                error: { message: "Session already exist" },
              });
            }
          }

          // web session exist
          const cookie = (await cookies()).get("fullauth-session-token");
          if (cookie?.value) {
            return NextResponse.json({
              ok: false,
              error: { message: "Session already exist" },
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
            throw new InternaError();
          }

          if (!redirectURL) {
            throw new OAuthRedirectError();
          }
          // return Response.redirect(redirectURL);
          return NextResponse.json({ ok: true, redirect: redirectURL });
        }
      } catch (error: any) {
        const err = returnAppropriateError(error);
        console.log(err);
        return NextResponse.json({ ok: false, error: err });
      }
    }

    if (params.fullauth.includes("update")) {
      const isMobile = params.fullauth.includes("mobile");
      if (sessionStrategry?.strategy === "token") {
        try {
          // Mobile
          if (isMobile) {
            const head = await headers();
            const sessionTtoken = head.get("token");
            const csrfToken = head.get("csrftoken");

            if (!sessionTtoken) {
              throw new SessionTokenError();
            }
            if (!csrfToken) {
              throw new CsrfTokenError();
            }

            const jwt = await verifyToken(sessionTtoken, options?.secret!);
            if (jwt.payload.csrfToken !== csrfToken) {
              throw new CsrfTokenError();
            }

            const token = await tokenCallback({
              options,
              token: jwt.payload as unknown as JWT,
              trigger: "update",
              updates: (body as any).data,
              user: null,
              auth: null,
              isMobile,
            });

            const sessionJwt = await generateToken(
              token ?? {},
              options?.secret!
            );
            return NextResponse.json({ token: sessionJwt });
          }
          // verify the csrf token
          const csrfCookie = (await cookies()).get(
            "fullauth-session-csrf-token"
          );
          if (!csrfCookie?.value) {
            throw new CsrfTokenError();
          }

          // await verifyToken(csrfCookie.value!, options?.secret!);

          // get the session cookie
          const cookie = (await cookies()).get("fullauth-session-token");

          if (!cookie?.value) {
            throw new SessionTokenError();
          }

          const data = body as any;

          // get session data from cookie
          const cookieData = await verifyToken(cookie.value!, options?.secret!);

          // check if csrfToken from cookie match the one in the session token
          if (cookieData.payload.csrfToken !== csrfCookie.value) {
            throw new CsrfTokenError();
          }

          const token = await tokenCallback({
            options,
            token: cookieData.payload as unknown as JWT,
            trigger: "update",
            updates: data,
            user: null,
            auth: null,
            isMobile,
          });
          // const newSessionData = DeepMerge(token, data as JWT);

          // geenrate  new session jwt
          const sessionJwt = await generateToken(token ?? {}, options?.secret!);
          // set new cookie
          (await cookies()).set({
            name: "fullauth-session-token",
            value: sessionJwt,
            httpOnly: true,
            maxAge:
              cookieData.payload.exp! - Math.floor(Date.now() / 1000) > 0
                ? cookieData.payload.exp! - Math.floor(Date.now() / 1000)
                : 60 * 60 * 24 * 7,
            secure: process.env.NODE_ENV === "development" ? false : true,
            sameSite: process.env.NODE_ENV === "development" ? false : "lax",
          });
          return NextResponse.json({
            ok: true,
            message: "Session updated.",
          });
        } catch (error: any) {
          const err = returnAppropriateError(error);
          console.log(err);
          return NextResponse.json({ ok: false, error: err });
        }
      }
    }

    // only for credentials provider
    if (params.fullauth.includes("callback")) {
      try {
        const isMobile = params.fullauth.includes("mobile");
        const provider = isMobile ? params.fullauth[2] : params.fullauth[1];
        const redirectUrl = (body as any).redirectUrl ?? "/";

        // no provider
        if (!(body as any).provider) {
          throw new InvalidProviderError();
        }

        // mobile session exist
        if (isMobile) {
          const head = await headers();
          const sessionTtoken = head.get("token");
          if (sessionTtoken) {
            return Response.json({
              ok: false,
              error: { message: "Session already exist" },
            });
          }
        }

        // web session exist
        const cookie = (await cookies()).get("fullauth-session-token");
        if (cookie?.value) {
          return NextResponse.json({
            ok: false,
            error: { message: "Session already exist" },
          });
        }

        const { user, auth } = await ProviderCallback({
          options,
          provider: provider,
          credentials: (body as any).credentials,
          isMobile,
        });

        if (!user) {
          throw new InternaError();
        }

        const jwt = await tokenCallback({
          options,
          token: null,
          trigger: "signin",
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
            message: "Session created.",
            token: tokenString,
            csrfToken: csrfToken,
            session: session,
          });
        }

        // For Web

        (await cookies()).set({
          name: "fullauth-session-token",
          value: tokenString,
          httpOnly: true,
          maxAge: sessionStrategry?.maxAge ?? 60 * 60 * 24 * 7,
          secure: process.env.NODE_ENV === "development" ? false : true,
          sameSite: process.env.NODE_ENV === "development" ? false : "lax",
        });
        (await cookies()).set({
          name: "fullauth-session-csrf-token",
          value: csrfToken,
          httpOnly: true,
          maxAge: sessionStrategry?.maxAge ?? 60 * 60 * 24 * 7,
          secure: process.env.NODE_ENV === "development" ? false : true,
          sameSite: process.env.NODE_ENV === "development" ? false : "lax",
        });

        const { url } = redirectCallback(redirectUrl);
        return Response.json({
          ok: true,
          message: "Session created.",
          redirect: url,
        });
      } catch (error: any) {
        const err = returnAppropriateError(error);
        console.log(err);
        return NextResponse.json({ ok: false, error: err });
      }
    }
  }

  if (method === "GET") {
    const params: {
      fullauth: string[];
    } = await ctx.params;

    // return the available providers
    if (params.fullauth.includes("providers")) {
      try {
        const isMobile = params.fullauth.includes("mobile");
        const providers = await getProviders(options, isMobile);
        return NextResponse.json({ ...providers });
      } catch (error: any) {
        console.log("Providers: ", error);
        return NextResponse.json({ ok: false, error: error });
      }
    }

    if (params.fullauth.includes("callback")) {
      try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get("code");
        const isMobile = params.fullauth.includes("mobile");
        const provider = isMobile ? params.fullauth[2] : params.fullauth[1];
        const state = searchParams.get("state");
        let redirectUrl = "";
        if (state) redirectUrl = decodeURIComponent(state);

        const { user, auth } = await ProviderCallback({
          options,
          provider: provider,
          code: code ?? "",
          isMobile,
        });

        if (!user) {
          throw new InternaError();
        }

        const jwt = await tokenCallback({
          options,
          token: null,
          trigger: "signin",
          updates: null,
          user,
          auth,
          isMobile,
        });

        // Generate csrf token to store it in cookie
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
            message: "Session created.",
            token: tokenString,
            csrfToken: csrfToken,
            session: session,
          });
        }

        // For Web

        (await cookies()).set({
          name: "fullauth-session-token",
          value: tokenString,
          httpOnly: true,
          maxAge: sessionStrategry?.maxAge ?? 60 * 60 * 24 * 7,
          secure: process.env.NODE_ENV === "development" ? false : true,
          sameSite: process.env.NODE_ENV === "development" ? false : "lax",
        });
        (await cookies()).set({
          name: "fullauth-session-csrf-token",
          value: csrfToken,
          httpOnly: true,
          maxAge: sessionStrategry?.maxAge ?? 60 * 60 * 24 * 7,
          secure: process.env.NODE_ENV === "development" ? false : true,
          sameSite: process.env.NODE_ENV === "development" ? false : "lax",
        });

        const { url } = redirectCallback(redirectUrl);

        return Response.redirect(
          url ?? `${process.env.NEXT_PUBLIC_FULLAUTH_URL}`
        );
      } catch (error: any) {
        const err = returnAppropriateError(error);
        console.log(err);
        return NextResponse.json({ ok: false, error: err });
      }
    }

    if (params.fullauth.includes("session")) {
      const isMobile = params.fullauth.includes("mobile");

      if (sessionStrategry?.strategy === "token") {
        // mobile
        if (isMobile) {
          try {
            const head = await headers();
            const sessionTtoken = head.get("token");
            if (!sessionTtoken) {
              return NextResponse.json({ ok: true, message: "No Session" });
              // throw new SessionTokenError('No Session');
            }
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
            const err = returnAppropriateError(error);
            console.log(err);
            return NextResponse.json({
              ok: false,
              error: err,
            });
          }
        }

        try {
          const cookie = (await cookies()).get("fullauth-session-token");

          if (!cookie) {
            (await cookies()).delete("fullauth-session-token");
            return NextResponse.json({ ok: true, message: "No Session" });
            // throw new SessionTokenError('No Session');
          }

          if (!cookie.value) throw new SessionTokenError();
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
          delete jwt?.csrfToken;
          delete jwt?.exp;
          delete jwt?.iat;
          delete jwt?.iss;
          return NextResponse.json({
            session: {
              ...jwt,
              expiresAt: exp,
            } as Session,
          });
        } catch (error: any) {
          (await cookies()).delete("fullauth-session-token");
          (await cookies()).delete("fullauth-session-csrf-token");
          const err = returnAppropriateError(error);
          console.log(err);
          return NextResponse.json({ ok: false, error: err });
        }
      }
    }
  }
  return NextResponse.json({ error: { message: "Method Unauthorised" } });
}

function NextHandler(options: AuthOptions): any;

function NextHandler(
  req: NextRequest,
  ctx: RouteContext<"/api/auth/[...fullauth]">,
  options: AuthOptions
): any;

// main function
function NextHandler(
  ...args: [AuthOptions] | Parameters<typeof NextAppRouteHandler>
) {
  if (args.length === 1) {
    return async (
      req: NextRequest,
      ctx: RouteContext<"/api/auth/[...fullauth]">
    ) => {
      const { fullauth } = await ctx.params;
      if (fullauth) {
        return await NextAppRouteHandler(req, ctx, args[0]);
      }
    };
  }
}

export default NextHandler;
