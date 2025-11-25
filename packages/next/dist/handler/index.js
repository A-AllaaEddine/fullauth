"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("next/server");
const headers_1 = require("next/headers");
const utils_1 = require("@fullauth/core/utils");
const core_1 = require("@fullauth/core");
const navigation_1 = require("next/navigation");
async function NextAppRouteHandler(req, ctx, options) {
    const sessionStrategry = {
        maxAge: 60 * 60 * 24 * 7,
        strategy: "token",
        ...options.session,
    };
    const method = await req.method;
    if (method === "POST") {
        const body = await (0, utils_1.getBodyData)(req);
        const params = await ctx.params;
        if (params.fullauth.includes("signout")) {
            const isMobile = params.fullauth.includes("mobile");
            if (isMobile) {
                return server_1.NextResponse.json({ ok: true, message: "Session Deleted." });
            }
            (await (0, headers_1.cookies)()).delete("fullauth-session-token");
            (await (0, headers_1.cookies)()).delete("fullauth-session-csrf-token");
            return server_1.NextResponse.json({ ok: true, message: "Session Deleted." });
        }
        if (params.fullauth.includes("signin")) {
            // DOING: add OAuth providers
            const isMobile = params.fullauth.includes("mobile");
            const redirectUrl = body.redirectUrl;
            try {
                // no provider
                if (!body.provider) {
                    throw new core_1.InvalidProviderError();
                }
                if (sessionStrategry?.strategy === "token") {
                    // mobile session exist
                    if (isMobile) {
                        const head = await (0, headers_1.headers)();
                        const sessionTtoken = head.get("token");
                        if (sessionTtoken) {
                            return Response.json({
                                ok: false,
                                error: { message: "Session already exist" },
                            });
                        }
                    }
                    // web session exist
                    const cookie = (await (0, headers_1.cookies)()).get("fullauth-session-token");
                    if (cookie?.value) {
                        return server_1.NextResponse.json({
                            ok: false,
                            error: { message: "Session already exist" },
                        });
                    }
                    // otherwise create new session
                    // call the provider to receive the user
                    const { redirectURL } = await (0, utils_1.ProviderSignin)({
                        options,
                        provider: body.provider,
                        isMobile,
                        redirectUrl,
                    });
                    if (!navigation_1.redirect) {
                        throw new core_1.InternaError();
                    }
                    if (!redirectURL) {
                        throw new core_1.OAuthRedirectError();
                    }
                    // return Response.redirect(redirectURL);
                    return server_1.NextResponse.json({ ok: true, redirect: redirectURL });
                }
            }
            catch (error) {
                const err = (0, utils_1.returnAppropriateError)(error);
                console.log(err);
                return server_1.NextResponse.json({ ok: false, error: err });
            }
        }
        if (params.fullauth.includes("update")) {
            const isMobile = params.fullauth.includes("mobile");
            if (sessionStrategry?.strategy === "token") {
                try {
                    // Mobile
                    if (isMobile) {
                        const head = await (0, headers_1.headers)();
                        const sessionTtoken = head.get("token");
                        const csrfToken = head.get("csrftoken");
                        if (!sessionTtoken) {
                            throw new core_1.SessionTokenError();
                        }
                        if (!csrfToken) {
                            throw new core_1.CsrfTokenError();
                        }
                        const jwt = await (0, utils_1.verifyToken)(sessionTtoken, options?.secret);
                        if (jwt.payload.csrfToken !== csrfToken) {
                            throw new core_1.CsrfTokenError();
                        }
                        const token = await (0, utils_1.tokenCallback)({
                            options,
                            token: jwt.payload,
                            trigger: "update",
                            updates: body.data,
                            user: null,
                            auth: null,
                            isMobile,
                        });
                        const sessionJwt = await (0, utils_1.generateToken)(token ?? {}, options?.secret);
                        return server_1.NextResponse.json({ token: sessionJwt });
                    }
                    // verify the csrf token
                    const csrfCookie = (await (0, headers_1.cookies)()).get("fullauth-session-csrf-token");
                    if (!csrfCookie?.value) {
                        throw new core_1.CsrfTokenError();
                    }
                    // await verifyToken(csrfCookie.value!, options?.secret!);
                    // get the session cookie
                    const cookie = (await (0, headers_1.cookies)()).get("fullauth-session-token");
                    if (!cookie?.value) {
                        throw new core_1.SessionTokenError();
                    }
                    const data = body;
                    // get session data from cookie
                    const cookieData = await (0, utils_1.verifyToken)(cookie.value, options?.secret);
                    // check if csrfToken from cookie match the one in the session token
                    if (cookieData.payload.csrfToken !== csrfCookie.value) {
                        throw new core_1.CsrfTokenError();
                    }
                    const token = await (0, utils_1.tokenCallback)({
                        options,
                        token: cookieData.payload,
                        trigger: "update",
                        updates: data,
                        user: null,
                        auth: null,
                        isMobile,
                    });
                    // const newSessionData = DeepMerge(token, data as JWT);
                    // geenrate  new session jwt
                    const sessionJwt = await (0, utils_1.generateToken)(token ?? {}, options?.secret);
                    // set new cookie
                    (await (0, headers_1.cookies)()).set({
                        name: "fullauth-session-token",
                        value: sessionJwt,
                        httpOnly: true,
                        maxAge: cookieData.payload.exp - Math.floor(Date.now() / 1000) > 0
                            ? cookieData.payload.exp - Math.floor(Date.now() / 1000)
                            : 60 * 60 * 24 * 7,
                        secure: process.env.NODE_ENV === "development" ? false : true,
                        sameSite: process.env.NODE_ENV === "development" ? false : "lax",
                    });
                    return server_1.NextResponse.json({
                        ok: true,
                        message: "Session updated.",
                    });
                }
                catch (error) {
                    const err = (0, utils_1.returnAppropriateError)(error);
                    console.log(err);
                    return server_1.NextResponse.json({ ok: false, error: err });
                }
            }
        }
        // only for credentials provider
        if (params.fullauth.includes("callback")) {
            try {
                const isMobile = params.fullauth.includes("mobile");
                const provider = isMobile ? params.fullauth[2] : params.fullauth[1];
                const redirectUrl = body.redirectUrl ?? "/";
                // no provider
                if (!body.provider) {
                    throw new core_1.InvalidProviderError();
                }
                // mobile session exist
                if (isMobile) {
                    const head = await (0, headers_1.headers)();
                    const sessionTtoken = head.get("token");
                    if (sessionTtoken) {
                        return Response.json({
                            ok: false,
                            error: { message: "Session already exist" },
                        });
                    }
                }
                // web session exist
                const cookie = (await (0, headers_1.cookies)()).get("fullauth-session-token");
                if (cookie?.value) {
                    return server_1.NextResponse.json({
                        ok: false,
                        error: { message: "Session already exist" },
                    });
                }
                const { user, auth } = await (0, utils_1.ProviderCallback)({
                    options,
                    provider: provider,
                    credentials: body.credentials,
                    isMobile,
                });
                if (!user) {
                    throw new core_1.InternaError();
                }
                const jwt = await (0, utils_1.tokenCallback)({
                    options,
                    token: null,
                    trigger: "signin",
                    updates: null,
                    user,
                    auth,
                    isMobile,
                });
                // Generate csrf token to storeit in cookie
                const csrfToken = await (0, utils_1.generateCsrfToken)(options.secret, options?.session?.maxAge);
                // generate token to store in cookie
                const tokenString = await (0, utils_1.generateToken)({ ...jwt, csrfToken: csrfToken }, options?.secret, options?.session?.maxAge);
                // get data from generated token to send to client on first sign in
                const returnJwt = await (0, utils_1.verifyToken)(tokenString, options?.secret);
                // remove unnecessary fields
                const exp = returnJwt?.payload.exp;
                // delete returnJwt.payload.csrfToken;
                // delete returnJwt.payload.iat;
                // delete returnJwt.payload.exp;
                // generate the session that gets returned to the client
                const session = {
                    ...returnJwt,
                    expiresAt: exp ?? options?.session?.maxAge ?? 60 * 60 * 24 * 7,
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
                (await (0, headers_1.cookies)()).set({
                    name: "fullauth-session-token",
                    value: tokenString,
                    httpOnly: true,
                    maxAge: sessionStrategry?.maxAge ?? 60 * 60 * 24 * 7,
                    secure: process.env.NODE_ENV === "development" ? false : true,
                    sameSite: process.env.NODE_ENV === "development" ? false : "lax",
                });
                (await (0, headers_1.cookies)()).set({
                    name: "fullauth-session-csrf-token",
                    value: csrfToken,
                    httpOnly: true,
                    maxAge: sessionStrategry?.maxAge ?? 60 * 60 * 24 * 7,
                    secure: process.env.NODE_ENV === "development" ? false : true,
                    sameSite: process.env.NODE_ENV === "development" ? false : "lax",
                });
                const { url } = (0, utils_1.redirectCallback)(redirectUrl);
                return Response.json({
                    ok: true,
                    message: "Session created.",
                    redirect: url,
                });
            }
            catch (error) {
                const err = (0, utils_1.returnAppropriateError)(error);
                console.log(err);
                return server_1.NextResponse.json({ ok: false, error: err });
            }
        }
    }
    if (method === "GET") {
        const params = await ctx.params;
        // return the available providers
        if (params.fullauth.includes("providers")) {
            try {
                const isMobile = params.fullauth.includes("mobile");
                const providers = await (0, utils_1.getProviders)(options, isMobile);
                return server_1.NextResponse.json({ ...providers });
            }
            catch (error) {
                console.log("Providers: ", error);
                return server_1.NextResponse.json({ ok: false, error: error });
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
                if (state)
                    redirectUrl = decodeURIComponent(state);
                const { user, auth } = await (0, utils_1.ProviderCallback)({
                    options,
                    provider: provider,
                    code: code ?? "",
                    isMobile,
                });
                if (!user) {
                    throw new core_1.InternaError();
                }
                const jwt = await (0, utils_1.tokenCallback)({
                    options,
                    token: null,
                    trigger: "signin",
                    updates: null,
                    user,
                    auth,
                    isMobile,
                });
                // Generate csrf token to store it in cookie
                const csrfToken = await (0, utils_1.generateCsrfToken)(options.secret, options?.session?.maxAge);
                // generate token to store in cookie
                const tokenString = await (0, utils_1.generateToken)({ ...jwt, csrfToken: csrfToken }, options?.secret, options?.session?.maxAge);
                // get data from generated token to send to client on first sign in
                const returnJwt = await (0, utils_1.verifyToken)(tokenString, options?.secret);
                // remove unnecessary fields
                const exp = returnJwt?.payload.exp;
                // delete returnJwt.csrfToken;
                // delete returnJwt.iat;
                // delete returnJwt.exp;
                // generate the session that gets returned to the client
                const session = {
                    // user: returnJwt.user,
                    ...returnJwt,
                    expiresAt: exp ?? options?.session?.maxAge ?? 60 * 60 * 24 * 7,
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
                (await (0, headers_1.cookies)()).set({
                    name: "fullauth-session-token",
                    value: tokenString,
                    httpOnly: true,
                    maxAge: sessionStrategry?.maxAge ?? 60 * 60 * 24 * 7,
                    secure: process.env.NODE_ENV === "development" ? false : true,
                    sameSite: process.env.NODE_ENV === "development" ? false : "lax",
                });
                (await (0, headers_1.cookies)()).set({
                    name: "fullauth-session-csrf-token",
                    value: csrfToken,
                    httpOnly: true,
                    maxAge: sessionStrategry?.maxAge ?? 60 * 60 * 24 * 7,
                    secure: process.env.NODE_ENV === "development" ? false : true,
                    sameSite: process.env.NODE_ENV === "development" ? false : "lax",
                });
                const { url } = (0, utils_1.redirectCallback)(redirectUrl);
                return Response.redirect(url ?? `${process.env.NEXT_PUBLIC_FULLAUTH_URL}`);
            }
            catch (error) {
                const err = (0, utils_1.returnAppropriateError)(error);
                console.log(err);
                return server_1.NextResponse.json({ ok: false, error: err });
            }
        }
        if (params.fullauth.includes("session")) {
            const isMobile = params.fullauth.includes("mobile");
            if (sessionStrategry?.strategy === "token") {
                // mobile
                if (isMobile) {
                    try {
                        const head = await (0, headers_1.headers)();
                        const sessionTtoken = head.get("token");
                        if (!sessionTtoken) {
                            return server_1.NextResponse.json({ ok: true, message: "No Session" });
                            // throw new SessionTokenError('No Session');
                        }
                        const token = await (0, utils_1.verifyToken)(sessionTtoken, options?.secret);
                        const jwt = await (0, utils_1.tokenCallback)({
                            options,
                            token: token.payload,
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
                        return server_1.NextResponse.json({
                            session: {
                                ...jwt,
                                expiresAt: exp,
                            },
                        });
                    }
                    catch (error) {
                        const err = (0, utils_1.returnAppropriateError)(error);
                        console.log(err);
                        return server_1.NextResponse.json({
                            ok: false,
                            error: err,
                        });
                    }
                }
                try {
                    const cookie = (await (0, headers_1.cookies)()).get("fullauth-session-token");
                    if (!cookie) {
                        (await (0, headers_1.cookies)()).delete("fullauth-session-token");
                        return server_1.NextResponse.json({ ok: true, message: "No Session" });
                        // throw new SessionTokenError('No Session');
                    }
                    if (!cookie.value)
                        throw new core_1.SessionTokenError();
                    const decoded = await (0, utils_1.verifyToken)(cookie.value, options.secret);
                    const jwt = await (0, utils_1.tokenCallback)({
                        options,
                        token: decoded.payload,
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
                    return server_1.NextResponse.json({
                        session: {
                            ...jwt,
                            expiresAt: exp,
                        },
                    });
                }
                catch (error) {
                    (await (0, headers_1.cookies)()).delete("fullauth-session-token");
                    (await (0, headers_1.cookies)()).delete("fullauth-session-csrf-token");
                    const err = (0, utils_1.returnAppropriateError)(error);
                    console.log(err);
                    return server_1.NextResponse.json({ ok: false, error: err });
                }
            }
        }
    }
    return server_1.NextResponse.json({ error: { message: "Method Unauthorised" } });
}
// main function
function NextHandler(...args) {
    if (args.length === 1) {
        return async (req, ctx) => {
            const { fullauth } = await ctx.params;
            if (fullauth) {
                return await NextAppRouteHandler(req, ctx, args[0]);
            }
        };
    }
}
exports.default = NextHandler;
