"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("next/server");
const headers_1 = require("next/headers");
const utils_1 = require("@lazyauth/core/utils");
async function NextAppRouteHandler(req, res, options) {
    const sessionStrategry = {
        maxAge: 60 * 60 * 24 * 7,
        strategry: 'token',
        ...options.session,
    };
    const method = await req.method;
    if (method === 'POST') {
        const body = await (0, utils_1.getBodyData)(req);
        const params = res.params;
        // return the available providers
        if (params.lazyauth.includes('providers')) {
            try {
                const providers = await (0, utils_1.getProviders)(options);
                return server_1.NextResponse.json({ ...providers });
            }
            catch (error) {
                console.log('Providers: ', error);
                return server_1.NextResponse.json({ ok: false, message: error.message });
            }
        }
        if (params.lazyauth.includes('signout')) {
            if (body.isMobile) {
                return server_1.NextResponse.json({ ok: true, message: 'Session Deleted.' });
            }
            await (0, headers_1.cookies)().delete('lazyauth-session-token');
            await (0, headers_1.cookies)().delete('lazyauth-session-csrf-token');
            return server_1.NextResponse.json({ ok: true, message: 'Session Deleted.' });
        }
        // if provider is not provided
        if (params.lazyauth.includes('callback')) {
            // TODO: add OAuth providers
        }
        if (params.lazyauth.includes('signin')) {
            try {
                // no provider
                if (!body.provider) {
                    return server_1.NextResponse.json({
                        ok: false,
                        message: 'Provider must be specified',
                    });
                }
                // if credentials are not provided when calling credentials provider
                if (!body.credentials) {
                    return server_1.NextResponse.json({
                        ok: false,
                        message: 'Credentials must be valid when using Credentials Provider.',
                    });
                }
                if (sessionStrategry?.strategry === 'token') {
                    // mobile session exist
                    if (body.isMobile) {
                        const token = body.token;
                        if (token) {
                            return Response.json({
                                ok: false,
                                message: 'Session already exist',
                            });
                        }
                    }
                    // web session exist
                    const cookie = (0, headers_1.cookies)().get('lazyauth-session-token');
                    if (cookie?.value) {
                        return server_1.NextResponse.json({
                            ok: false,
                            message: 'Session already exist',
                        });
                    }
                    // otherwise create new session
                    // call the provider to receive the user
                    const { user, auth } = await (0, utils_1.callProvider)({
                        options,
                        provider: body.provider,
                        credentials: body.credentials,
                    });
                    if (!user) {
                        return server_1.NextResponse.json({
                            ok: false,
                            message: 'Internal Server Err',
                        });
                    }
                    const jwt = await (0, utils_1.tokenCallback)({
                        options,
                        token: null,
                        trigger: 'signin',
                        updates: null,
                        user: user,
                        auth,
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
                    if (body.isMobile) {
                        return Response.json({
                            ok: true,
                            message: 'Session created.',
                            token: tokenString,
                            csrfToken: csrfToken,
                            session: session,
                        });
                    }
                    // For Web
                    const response = server_1.NextResponse.json({
                        ok: true,
                        message: 'Session created.',
                        session: session,
                    });
                    // setting the cookie
                    response.cookies.set({
                        name: 'lazyauth-session-token',
                        value: tokenString,
                        httpOnly: true,
                        maxAge: sessionStrategry?.maxAge ?? 60 * 60 * 24 * 7,
                        secure: process.env.NODE_ENV === 'development' ? false : true,
                        sameSite: process.env.NODE_ENV === 'development' ? false : true,
                    });
                    response.cookies.set({
                        name: 'lazyauth-session-csrf-token',
                        value: csrfToken,
                        httpOnly: true,
                        maxAge: sessionStrategry?.maxAge ?? 60 * 60 * 24 * 7,
                        secure: process.env.NODE_ENV === 'development' ? false : true,
                        sameSite: process.env.NODE_ENV === 'development' ? false : true,
                    });
                    return response;
                }
            }
            catch (error) {
                console.log('Next Handler: ', error);
                return server_1.NextResponse.json({ ok: false, message: error.message });
            }
        }
        if (params.lazyauth.includes('update')) {
            // Mobile
            if (sessionStrategry?.strategry === 'token') {
                if (body.isMobile) {
                    const jwt = await (0, utils_1.verifyToken)(body.token, options?.secret);
                    if (!body.csrfToken) {
                        return server_1.NextResponse.json({
                            ok: false,
                            message: 'Invalid CSRF Token',
                        });
                    }
                    if (jwt.csrfToken !== body.csrfToken) {
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
                    });
                    const sessionJwt = await (0, utils_1.generateToken)(token, options?.secret);
                    return server_1.NextResponse.json({ token: sessionJwt });
                }
                // verify the csrf token
                const csrfCookie = await (0, headers_1.cookies)().get('lazyauth-session-csrf-token');
                if (!csrfCookie) {
                    return server_1.NextResponse.json({
                        ok: false,
                        message: 'Invalid CSRF Token',
                    });
                }
                // await verifyToken(csrfCookie.value!, options?.secret!);
                // get the session cookie
                const cookie = await (0, headers_1.cookies)().get('lazyauth-session-token');
                if (!cookie) {
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
                });
                // const newSessionData = DeepMerge(token, data as JWT);
                // geenrate  new session jwt
                const sessionJwt = await (0, utils_1.generateToken)(token, options?.secret);
                // set new cookie
                const response = server_1.NextResponse.json({
                    ok: true,
                    message: 'Session updated.',
                });
                response.cookies.set({
                    name: 'lazyauth-session-token',
                    value: sessionJwt,
                    httpOnly: true,
                    maxAge: cookieData.exp - Math.floor(Date.now() / 1000) ?? 60 * 60 * 24 * 7,
                    secure: process.env.NODE_ENV === 'development' ? false : true,
                    sameSite: process.env.NODE_ENV === 'development' ? false : true,
                });
                return response;
            }
        }
        if (params.lazyauth.includes('session')) {
            if (sessionStrategry?.strategry === 'token') {
                // mobile
                if (body.isMobile) {
                    if (!body.token) {
                        return server_1.NextResponse.json({
                            message: 'No Session',
                        });
                    }
                    try {
                        const token = await (0, utils_1.verifyToken)(body.token, options?.secret);
                        const jwt = await (0, utils_1.tokenCallback)({
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
                        return server_1.NextResponse.json({
                            session: {
                                ...jwt,
                                expiresAt: exp,
                            },
                        });
                    }
                    catch (error) {
                        console.log(error);
                        return server_1.NextResponse.json({ message: error.message });
                    }
                }
                const cookie = (0, headers_1.cookies)().get('lazyauth-session-token');
                if (!cookie) {
                    const response = server_1.NextResponse.json({
                        message: 'No Session',
                    });
                    response.cookies.delete('lazyauth-session-token');
                    return response;
                }
                // await verifyCsrfToken(cookie.value, options.secret!);
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
                    const response = server_1.NextResponse.json({
                        error: error.message,
                    });
                    response.cookies.delete('lazyauth-session-token');
                    return response;
                }
            }
        }
        if (params.lazyauth.includes('csrf')) {
            // Generate csrf token
            const csrfToken = await (0, utils_1.generateToken)({}, options.secret);
            if (body.isMobile) {
                return server_1.NextResponse.json({ token: csrfToken });
            }
            const response = server_1.NextResponse.json({
                message: 'Csrf Token generated.',
            });
            response.cookies.set({
                name: 'lazyauth-session-csrf-token',
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
        const params = res.params;
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
