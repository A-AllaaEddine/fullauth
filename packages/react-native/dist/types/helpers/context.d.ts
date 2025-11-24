import { Session } from '@fullauth/core';
import React, { Dispatch, SetStateAction } from 'react';
export declare const sessionContext: React.Context<{
    status: string;
    session: null | Session;
    setSession: Dispatch<SetStateAction<any>>;
    update: (data?: any) => Promise<void>;
    baseUrl?: string;
} | undefined>;
export declare const SessionProvider: ({ children, baseUrl, }: {
    children: any;
    baseUrl?: string;
}) => React.JSX.Element;
