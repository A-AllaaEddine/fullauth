"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
const signOut = async () => {
    try {
        const resp = await fetch(`${process.env.EXPO_PUBLIC_LAZYAUTH_URL ?? 'http://localhost:3000'}/api/auth/signout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isMobile: false }),
        });
        if (!resp.ok) {
            return {
                ok: false,
                error: 'Internal Server Error',
            };
        }
        await async_storage_1.default.removeItem('lazyauth-session-token');
        await async_storage_1.default.removeItem('lazyauth-session-csrf-token');
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
exports.default = signOut;
