'use client';
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionProvider = exports.sessionContext = void 0;
const react_1 = __importStar(require("react"));
exports.sessionContext = (0, react_1.createContext)(undefined);
const SessionProvider = ({ children, session, }) => {
    const [currentSession, setSession] = (0, react_1.useState)(session ?? null);
    const [status, setStatus] = (0, react_1.useState)('loading');
    const getSession = async () => {
        try {
            setStatus('loading');
            const resp = await fetch(`${process.env.NEXT_PUBLIC_FULLAUTH_URL ?? 'http://localhost:3000'}/api/auth/session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isMobile: false }),
            });
            const data = await resp.json();
            if (!resp.ok) {
                throw data.error;
            }
            if (data.message === 'No Session') {
                setSession(null);
                return null;
            }
            //   console.log(data);
            if (data.session) {
                setStatus('authenticated');
                setSession(data.session);
            }
            else {
                setStatus('unauthenticated');
                setSession(null);
            }
            return data.session;
        }
        catch (error) {
            console.log(error);
        }
    };
    (0, react_1.useEffect)(() => {
        getSession();
    }, []);
    async function update(data) {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_FULLAUTH_URL ?? 'http://localhost:3000'}/api/auth/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!resp.ok) {
            const data = await resp.json();
            return {
                ok: resp.ok,
                status: resp.status,
                error: data.message,
            };
        }
        getSession();
    }
    return (react_1.default.createElement(exports.sessionContext.Provider, { value: { session: currentSession, status, update, setSession } }, children));
};
exports.SessionProvider = SessionProvider;
