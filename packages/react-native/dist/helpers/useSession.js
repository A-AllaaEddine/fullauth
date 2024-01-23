"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const context_1 = require("./context");
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
