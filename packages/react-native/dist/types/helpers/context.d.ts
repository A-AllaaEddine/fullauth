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
} | undefined>;
export declare const SessionProvider: ({ children }: {
    children: any;
}) => React.JSX.Element;
