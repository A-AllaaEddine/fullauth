import { Session } from '@fullauth/core';
import React, { Dispatch, SetStateAction } from 'react';
export declare const sessionContext: React.Context<{
    status: string;
    session: null | Session;
    setSession: Dispatch<SetStateAction<any>>;
    update: (data?: any) => Promise<void>;
} | undefined>;
export declare const SessionProvider: ({ children, session, }: {
    children: any;
    session?: null | Session;
}) => React.JSX.Element;
