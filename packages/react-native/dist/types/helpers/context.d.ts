import { Session } from '@fullauth/core';
import React, { Dispatch, SetStateAction } from 'react';
export type Update = {
    ok: boolean;
    status: number;
    error: any;
} | null | undefined;
export declare const sessionContext: React.Context<{
    status: string;
    session: null | Session;
    setSession: Dispatch<SetStateAction<any>>;
    update: (data?: any) => Promise<Update>;
    baseUrl?: string | undefined;
} | undefined>;
export declare const SessionProvider: ({ children, baseUrl, }: {
    children: any;
    baseUrl?: string | undefined;
}) => React.JSX.Element;
