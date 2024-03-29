"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProviders = void 0;
const getProviders = async ({ baseUrl }) => {
    const providersResp = await fetch(`${baseUrl ?? process.env.EXPO_PUBLIC_FULLAUTH_URL ?? 'http://localhost:3000'}/api/auth/mobile/providers`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!providersResp.ok) {
        throw new Error('Error while getting providers');
    }
    const providers = await providersResp.json();
    return providers;
};
exports.getProviders = getProviders;
