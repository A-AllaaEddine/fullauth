"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@fullauth/core/utils");
const headers_1 = require("next/headers");
/**
 * Functuion that returns session object on server side
 *
 * @param {AuthOptions} authOptions - The options  used to inialize the handler
 * @param {Requesr | NextRequest} req (optional) - The request object
 * @returns {Promise<session>} The session object.bject.
 * @throws {AuthenticationError} If error occurs, return error object.
 */
const getSession = async (options, req) => {
    try {
        let token = null;
        // with request (to support mobile apps)
        if (req) {
            // check for token in headers
            const headers = req.headers;
            const sessionToken = headers.get('token');
            // case 1: there is token in headers: use that token to get session data
            if (sessionToken) {
                const csrfToken = headers.get('csrfToken');
                // check for csrf token
                if (!csrfToken) {
                    console.log('Fullauth: Invalid csrf token');
                    return null;
                }
                token = await (0, utils_1.verifyToken)(sessionToken, options?.secret);
                if (!token) {
                    console.log('Fullauth: Invalid JWT');
                    return null;
                }
                if (token.csrfToken !== csrfToken) {
                    console.log('Fullauth: Invalid csrf token');
                    return null;
                }
                const exp = token?.exp;
                delete token.csrfToken;
                delete token.exp;
                delete token.iat;
                const session = {
                    ...token,
                    expiresAt: exp,
                };
                // return session object
                return session;
            }
            // case 2: there is no token in headers: check cookies
            const cookie = (0, headers_1.cookies)().get('fullauth-session-token');
            const csrfCookie = (0, headers_1.cookies)().get('fullauth-session-csrf-token');
            if (!cookie?.value) {
                console.log('Fullauth: Invalid cookie');
                return null;
            }
            if (!csrfCookie?.value) {
                console.log('Fullauth: Invalid crsf cookie');
                return null;
            }
            token = await (0, utils_1.verifyToken)(cookie?.value, options?.secret);
            if (!token) {
                console.log('Fullauth: Invalid token');
                return null;
            }
            if (token.csrfToken !== csrfCookie?.value) {
                console.log('Fullauth: Invalid csrf token');
                return null;
            }
            const exp = token?.exp;
            delete token.csrfToken;
            delete token.exp;
            delete token.iat;
            const session = {
                ...token,
                expiresAt: exp,
            };
            return session;
        }
        const cookie = (0, headers_1.cookies)().get('fullauth-session-token');
        const csrfCookie = (0, headers_1.cookies)().get('fullauth-session-csrf-token');
        if (!cookie?.value) {
            console.log('Fullauth: Invalid cookie');
            return null;
        }
        if (!csrfCookie?.value) {
            console.log('Invalid crsf cookie');
            return null;
        }
        token = await (0, utils_1.verifyToken)(cookie?.value, options?.secret);
        if (!token) {
            console.log('Fullauth: Invalid token');
            return null;
        }
        if (token.csrfToken !== csrfCookie?.value) {
            console.log('Fullauth: Invalid csrf token');
            return null;
        }
        const exp = token?.exp;
        delete token.csrfToken;
        delete token.exp;
        delete token.iat;
        const session = {
            ...token,
            expiresAt: exp,
        };
        return session;
        // Default behaviour
    }
    catch (error) {
        // console.log(error);
        if (error.message === 'jwt expired') {
            return null;
        }
        throw error;
    }
};
async function getServerSession(...args) {
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
exports.default = getServerSession;
