"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const context_1 = require("./context");
/**
 * React hook that return session object, update fucntion and auth status
 *
 * @returns {session} The session object.
 * @returns {status} The authentication status.
 * @returns {update} Fucntion to update the session object.
 * @throws {AuthenticationError} If error occurs, return error object.
 */
const useSession = () => {
    const context = (0, react_1.useContext)(context_1.sessionContext);
    if (!context) {
        throw new Error('Context is not found, make sure you wrap the app with the session provider');
    }
    return {
        status: context.status,
        session: context.session,
        update: context.update,
    };
};
exports.default = useSession;
