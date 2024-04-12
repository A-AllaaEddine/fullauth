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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionProvider = exports.sessionContext = void 0;
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
const react_1 = __importStar(require("react"));
const authHeader_1 = require("./authHeader");
exports.sessionContext = (0, react_1.createContext)(undefined);
const SessionProvider = ({ children, baseUrl, }) => {
    const [currentSession, setSession] = (0, react_1.useState)(null);
    const [status, setStatus] = (0, react_1.useState)('unauthenticated');
    const getSession = async () => {
        try {
            setStatus('authenticating');
            // const token = await AsyncStorage.getItem('fullauth-session-token');
            // if (!token) {
            //   setSession(null);
            //   return null;
            // }
            const resp = await fetch(`${baseUrl ??
                process.env.EXPO_PUBLIC_FULLAUTH_URL ??
                'http://localhost:3000'}/api/auth/mobile/session`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(await (0, authHeader_1.authHeaders)()),
                },
            });
            const data = await resp.json();
            if (!resp.ok) {
                throw data.error;
            }
            if (data.message === 'Session Deleted.') {
                setStatus('unauthenticated');
                setSession(null);
                await async_storage_1.default.removeItem('fullauth-session-token');
                await async_storage_1.default.removeItem('fullauth-session-csrf-token');
                return null;
            }
            if (data.message === 'No Session') {
                setStatus('unauthenticated');
                setSession(null);
                await async_storage_1.default.removeItem('fullauth-session-token');
                await async_storage_1.default.removeItem('fullauth-session-csrf-token');
                return null;
            }
            if (data.message === 'jwt expired') {
                setStatus('unauthenticated');
                await async_storage_1.default.removeItem('fullauth-session-token');
                await async_storage_1.default.removeItem('fullauth-session-csrf-token');
                return null;
            }
            //   console.log(data);
            if (!data.session) {
                setStatus('unauthenticated');
                setSession(null);
                await async_storage_1.default.removeItem('fullauth-session-token');
                await async_storage_1.default.removeItem('fullauth-session-csrf-token');
                return null;
            }
            setStatus('authenticated');
            setSession(data.session);
            return data.session;
        }
        catch (error) {
            console.log(error);
            await async_storage_1.default.removeItem('fullauth-session-token');
            await async_storage_1.default.removeItem('fullauth-session-csrf-token');
            throw error;
        }
    };
    (0, react_1.useEffect)(() => {
        getSession();
    }, []);
    const update = async (data = {}) => {
        const token = await async_storage_1.default.getItem('fullauth-session-token');
        if (!token) {
            setSession(null);
            return null;
        }
        const resp = await fetch(`${baseUrl ??
            process.env.EXPO_PUBLIC_FULLAUTH_URL ??
            'http://localhost:3000'}/api/auth/mobile/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(await (0, authHeader_1.authHeaders)()),
            },
            body: JSON.stringify(data),
        });
        const returnData = await resp.json();
        if (!resp.ok) {
            return {
                ok: resp.ok,
                status: returnData.status,
                error: returnData.message,
            };
        }
        // const newToken = await resp.json();
        await async_storage_1.default.setItem('fullauth-session-token', returnData.token);
        await getSession();
    };
    return (react_1.default.createElement(exports.sessionContext.Provider, { value: {
            session: currentSession,
            status,
            update,
            setSession,
            baseUrl,
        } }, children));
};
exports.SessionProvider = SessionProvider;
