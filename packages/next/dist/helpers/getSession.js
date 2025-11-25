"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@fullauth/core/utils");
const headers_1 = require("next/headers");
/**
 * Functuion that returns session object on server side
 *
 * @param {String} secret - The JWT secret used to in the handler
 * @param {Requesr | NextRequest} req (optional) - The request object
 * @returns {Promise<session>} The session object.bject.
 * @throws {AuthenticationError} If error occurs, return error object.
 */
const getSession = async (secret, req) => {
    try {
        let token = null;
        // with request (to support mobile apps)
        if (req) {
            // check for token in headers
            const Allheaders = await (0, headers_1.headers)();
            const sessionToken = Allheaders.get("token");
            // case 1: there is token in headers: use that token to get session data
            if (sessionToken) {
                const csrfToken = Allheaders.get("csrfToken");
                // check for csrf token
                if (!csrfToken) {
                    // console.log('Fullauth: Invalid csrf token');
                    return null;
                }
                token = (await (0, utils_1.verifyToken)(sessionToken, secret))
                    .payload;
                if (!token) {
                    // console.log('Fullauth: Invalid JWT');
                    return null;
                }
                if (token.csrfToken !== csrfToken) {
                    // console.log('Fullauth: Invalid csrf token');
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
            const cookie = (await (0, headers_1.cookies)()).get("fullauth-session-token");
            const csrfCookie = (await (0, headers_1.cookies)()).get("fullauth-session-csrf-token");
            if (!cookie?.value) {
                // console.log('Fullauth: Invalid cookie');
                return null;
            }
            if (!csrfCookie?.value) {
                // console.log('Fullauth: Invalid crsf cookie');
                return null;
            }
            token = (await (0, utils_1.verifyToken)(cookie?.value, secret))
                .payload;
            if (!token) {
                // console.log('Fullauth: Invalid token');
                return null;
            }
            if (token.csrfToken !== csrfCookie?.value) {
                // console.log('Fullauth: Invalid csrf token');
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
        const cookie = (await (0, headers_1.cookies)()).get("fullauth-session-token");
        const csrfCookie = (await (0, headers_1.cookies)()).get("fullauth-session-csrf-token");
        if (!cookie?.value) {
            // console.log('Fullauth: Invalid cookie');
            return null;
        }
        if (!csrfCookie?.value) {
            // console.log('Invalid crsf cookie');
            return null;
        }
        token = (await (0, utils_1.verifyToken)(cookie?.value, secret))
            .payload;
        if (!token) {
            // console.log('Fullauth: Invalid token');
            return null;
        }
        if (token.csrfToken !== csrfCookie?.value) {
            // console.log('Fullauth: Invalid csrf token');
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
        if (error.message === "jwt expired") {
            return null;
        }
        throw error;
    }
};
async function getServerSession(...args) {
    // no request ex: server component
    if (args.length === 1) {
        const secret = args[0];
        return getSession(secret);
    }
    // with request object
    const secret = args[0];
    const req = args[1];
    return getSession(secret, req);
}
exports.default = getServerSession;
