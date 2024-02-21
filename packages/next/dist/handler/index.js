"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("next/server");
const headers_1 = require("next/headers");
const utils_1 = require("@fullauth/core/utils");
const navigation_1 = require("next/navigation");
const utils_2 = require("@fullauth/core/utils");
async function NextAppRouteHandler(req, res, options) {
    const sessionStrategry = {
        maxAge: 60 * 60 * 24 * 7,
        strategy: 'token',
        ...options.session,
    };
    const method = await req.method;
    if (method === 'POST') {
        const body = await (0, utils_1.getBodyData)(req);
        const params = res.params;
        if (params.fullauth.includes('signout')) {
            const isMobile = params.fullauth.includes('mobile');
            if (isMobile) {
                return server_1.NextResponse.json({ ok: true, message: 'Session Deleted.' });
            }
            (0, headers_1.cookies)().delete('fullauth-session-token');
            (0, headers_1.cookies)().delete('fullauth-session-csrf-token');
            return server_1.NextResponse.json({ ok: true, message: 'Session Deleted.' });
        }
        if (params.fullauth.includes('signin')) {
            // DOING: add OAuth providers
            const isMobile = params.fullauth.includes('mobile');
            const redirectUrl = body.redirectUrl;
            try {
                // no provider
                if (!body.provider) {
                    return server_1.NextResponse.json({
                        ok: false,
                        message: 'Provider must be specified',
                    });
                }
                if (sessionStrategry?.strategy === 'token') {
                    // mobile session exist
                    if (isMobile) {
                        const head = (0, headers_1.headers)();
                        const sessionTtoken = head.get('token');
                        if (sessionTtoken) {
                            return Response.json({
                                ok: false,
                                message: 'Session already exist',
                            });
                        }
                    }
                    // web session exist
                    const cookie = (0, headers_1.cookies)().get('fullauth-session-token');
                    if (cookie?.value) {
                        return server_1.NextResponse.json({
                            ok: false,
                            message: 'Session already exist',
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
                        return server_1.NextResponse.json({
                            ok: false,
                            message: 'Internal Server Error',
                        });
                    }
                    if (!redirectURL) {
                        throw new Error('Invalid Google Redirect Url');
                    }
                    // return Response.redirect(redirectURL);
                    return server_1.NextResponse.json({ ok: true, redirect: redirectURL });
                }
            }
            catch (error) {
                console.log('Next Handler: ', error);
                return server_1.NextResponse.json({ ok: false, message: error.message });
            }
        }
        if (params.fullauth.includes('update')) {
            const isMobile = params.fullauth.includes('mobile');
            if (sessionStrategry?.strategy === 'token') {
                // Mobile
                if (isMobile) {
                    const head = (0, headers_1.headers)();
                    const sessionTtoken = head.get('token');
                    const csrfToken = head.get('csrftoken');
                    if (!sessionTtoken) {
                        return server_1.NextResponse.json({
                            ok: false,
                            message: 'Invalid Session Token',
                        });
                    }
                    if (!csrfToken) {
                        return server_1.NextResponse.json({
                            ok: false,
                            message: 'Invalid CSRF Token',
                        });
                    }
                    const jwt = await (0, utils_1.verifyToken)(sessionTtoken, options?.secret);
                    if (jwt.csrfToken !== csrfToken) {
                        server_1.NextResponse.json({
                            ok: false,
                            message: 'Invalid CSRF Token',
                        });
                    }
                    const token = await (0, utils_1.tokenCallback)({
                        options,
                        token: jwt,
                        trigger: 'update',
                        updates: body.data,
                        user: null,
                        auth: null,
                        isMobile,
                    });
                    const sessionJwt = await (0, utils_1.generateToken)(token, options?.secret);
                    return server_1.NextResponse.json({ token: sessionJwt });
                }
                // verify the csrf token
                const csrfCookie = await (0, headers_1.cookies)().get('fullauth-session-csrf-token');
                if (!csrfCookie?.value) {
                    return server_1.NextResponse.json({
                        ok: false,
                        message: 'Invalid CSRF Token',
                    });
                }
                // await verifyToken(csrfCookie.value!, options?.secret!);
                // get the session cookie
                const cookie = await (0, headers_1.cookies)().get('fullauth-session-token');
                if (!cookie?.value) {
                    return server_1.NextResponse.json({
                        ok: false,
                        message: 'Invalid Session Token',
                    });
                }
                const data = body;
                // get session data from cookie
                const cookieData = await (0, utils_1.verifyToken)(cookie.value, options?.secret);
                // check if csrfToken from cookie match the one in the session token
                if (cookieData.csrfToken !== csrfCookie.value) {
                    server_1.NextResponse.json({
                        ok: false,
                        message: 'Invalid CSRF Token',
                    });
                }
                const token = await (0, utils_1.tokenCallback)({
                    options,
                    token: cookieData,
                    trigger: 'update',
                    updates: data,
                    user: null,
                    auth: null,
                    isMobile,
                });
                // const newSessionData = DeepMerge(token, data as JWT);
                // geenrate  new session jwt
                const sessionJwt = await (0, utils_1.generateToken)(token, options?.secret);
                // set new cookie
                (0, headers_1.cookies)().set({
                    name: 'fullauth-session-token',
                    value: sessionJwt,
                    httpOnly: true,
                    maxAge: cookieData.exp - Math.floor(Date.now() / 1000) ?? 60 * 60 * 24 * 7,
                    secure: process.env.NODE_ENV === 'development' ? false : true,
                    sameSite: process.env.NODE_ENV === 'development' ? false : true,
                });
                return server_1.NextResponse.json({
                    ok: true,
                    message: 'Session updated.',
                });
            }
        }
        if (params.fullauth.includes('callback')) {
            try {
                const isMobile = params.fullauth.includes('mobile');
                const provider = isMobile ? params.fullauth[2] : params.fullauth[1];
                const redirectUrl = body.redirectUrl;
                const { user, auth } = await (0, utils_1.ProviderCallback)({
                    options,
                    provider: provider,
                    credentials: body.credentials,
                    isMobile,
                });
                if (!user) {
                    return server_1.NextResponse.json({
                        ok: false,
                        message: 'Internal Server Error',
                    });
                }
                const jwt = await (0, utils_1.tokenCallback)({
                    options,
                    token: null,
                    trigger: 'signin',
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
                const exp = returnJwt?.exp;
                delete returnJwt.csrfToken;
                delete returnJwt.iat;
                delete returnJwt.exp;
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
                        message: 'Session created.',
                        token: tokenString,
                        csrfToken: csrfToken,
                        session: session,
                    });
                }
                // For Web
                (0, headers_1.cookies)().set({
                    name: 'fullauth-session-token',
                    value: tokenString,
                    httpOnly: true,
                    maxAge: sessionStrategry?.maxAge ?? 60 * 60 * 24 * 7,
                    secure: process.env.NODE_ENV === 'development' ? false : true,
                    sameSite: process.env.NODE_ENV === 'development' ? false : true,
                });
                (0, headers_1.cookies)().set({
                    name: 'fullauth-session-csrf-token',
                    value: csrfToken,
                    httpOnly: true,
                    maxAge: sessionStrategry?.maxAge ?? 60 * 60 * 24 * 7,
                    secure: process.env.NODE_ENV === 'development' ? false : true,
                    sameSite: process.env.NODE_ENV === 'development' ? false : true,
                });
                const { url } = (0, utils_2.redirectCallback)(redirectUrl);
                return Response.json({
                    ok: true,
                    message: 'Session created.',
                    redirect: url,
                });
            }
            catch (error) {
                console.log(error);
                return server_1.NextResponse.json({ ok: false, message: error.message });
            }
        }
    }
    if (method === 'GET') {
        const params = res.params;
        // return the available providers
        if (params.fullauth.includes('providers')) {
            try {
                const isMobile = params.fullauth.includes('mobile');
                const providers = await (0, utils_1.getProviders)(options, isMobile);
                return server_1.NextResponse.json({ ...providers });
            }
            catch (error) {
                console.log('Providers: ', error);
                return server_1.NextResponse.json({ ok: false, message: error.message });
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
                if (state)
                    redirectUrl = decodeURIComponent(state);
                const { user, auth } = await (0, utils_1.ProviderCallback)({
                    options,
                    provider: provider,
                    code: code ?? '',
                    isMobile,
                });
                if (!user) {
                    return server_1.NextResponse.json({
                        ok: false,
                        message: 'Internal Server Error',
                    });
                }
                const jwt = await (0, utils_1.tokenCallback)({
                    options,
                    token: null,
                    trigger: 'signin',
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
                const exp = returnJwt?.exp;
                delete returnJwt.csrfToken;
                delete returnJwt.iat;
                delete returnJwt.exp;
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
                        message: 'Session created.',
                        token: tokenString,
                        csrfToken: csrfToken,
                        session: session,
                    });
                }
                // For Web
                (0, headers_1.cookies)().set({
                    name: 'fullauth-session-token',
                    value: tokenString,
                    httpOnly: true,
                    maxAge: sessionStrategry?.maxAge ?? 60 * 60 * 24 * 7,
                    secure: process.env.NODE_ENV === 'development' ? false : true,
                    sameSite: process.env.NODE_ENV === 'development' ? false : true,
                });
                (0, headers_1.cookies)().set({
                    name: 'fullauth-session-csrf-token',
                    value: csrfToken,
                    httpOnly: true,
                    maxAge: sessionStrategry?.maxAge ?? 60 * 60 * 24 * 7,
                    secure: process.env.NODE_ENV === 'development' ? false : true,
                    sameSite: process.env.NODE_ENV === 'development' ? false : true,
                });
                const { url } = (0, utils_2.redirectCallback)(redirectUrl);
                return Response.redirect(url ?? `${process.env.NEXT_PUBLIC_FULLAUTH_URL}`);
            }
            catch (error) {
                console.log(error);
                return server_1.NextResponse.json({ ok: false, message: error.message });
            }
        }
        if (params.fullauth.includes('session')) {
            const isMobile = params.fullauth.includes('mobile');
            if (sessionStrategry?.strategy === 'token') {
                // mobile
                if (isMobile) {
                    const head = (0, headers_1.headers)();
                    const sessionTtoken = head.get('token');
                    if (!sessionTtoken) {
                        return server_1.NextResponse.json({
                            message: 'No Session',
                        });
                    }
                    try {
                        const token = await (0, utils_1.verifyToken)(sessionTtoken, options?.secret);
                        const jwt = await (0, utils_1.tokenCallback)({
                            options,
                            token: token,
                            trigger: undefined,
                            updates: null,
                            user: null,
                            auth: null,
                            isMobile,
                        });
                        const exp = jwt?.exp;
                        delete jwt.csrfToken;
                        delete jwt.exp;
                        delete jwt.iat;
                        return server_1.NextResponse.json({
                            session: {
                                ...jwt,
                                user: jwt.user ?? {},
                                expiresAt: exp,
                            },
                        });
                    }
                    catch (error) {
                        console.log(error);
                        return server_1.NextResponse.json({ message: error.message });
                    }
                }
                const cookie = (0, headers_1.cookies)().get('fullauth-session-token');
                if (!cookie) {
                    (0, headers_1.cookies)().delete('fullauth-session-token');
                    return server_1.NextResponse.json({
                        message: 'No Session',
                    });
                }
                if (!cookie.value)
                    return server_1.NextResponse.json({ message: 'Invalid Cookie' });
                try {
                    const decoded = await (0, utils_1.verifyToken)(cookie.value, options.secret);
                    const jwt = await (0, utils_1.tokenCallback)({
                        options,
                        token: decoded,
                        trigger: undefined,
                        updates: null,
                        user: null,
                        auth: null,
                        isMobile,
                    });
                    const exp = jwt?.exp;
                    delete jwt.csrfToken;
                    delete jwt.exp;
                    delete jwt.iat;
                    return server_1.NextResponse.json({
                        session: {
                            ...jwt,
                            expiresAt: exp,
                        },
                    });
                }
                catch (error) {
                    console.log(error);
                    (0, headers_1.cookies)().delete('fullauth-session-token');
                    return server_1.NextResponse.json({
                        error: error.message,
                    });
                }
            }
        }
    }
    return server_1.NextResponse.json({ message: 'Method Unauthorised' });
}
// main function
function NextHandler(...args) {
    // | Parameters<typeof NextAuthApiHandler>
    if (args.length === 1) {
        return async (req, res) => {
            if (res?.params) {
                return await NextAppRouteHandler(req, res, args[0]);
            }
        };
    }
}
exports.default = NextHandler;
