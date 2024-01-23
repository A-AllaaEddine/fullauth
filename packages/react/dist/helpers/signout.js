'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signOut = async () => {
    try {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_LAZYAUTH_URL ?? 'http://localhost:3000'}/api/auth/signout`, {
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
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
exports.default = signOut;
