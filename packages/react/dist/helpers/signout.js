'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signOut = async () => {
    try {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_FULLAUTH_URL ?? 'http://localhost:3000'}/api/auth/signout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });
        if (!resp.ok) {
            throw new Error('Internal Server Error');
        }
        window.location.reload();
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
exports.default = signOut;
