'use client';

import { Session } from '@fullauth/core';
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react';

export type Update =
  | {
      ok: boolean;
      status: number;
      error: any;
    }
  | null
  | undefined;

export const sessionContext = createContext<
  | {
      status: string;
      session: null | Session;
      setSession: Dispatch<SetStateAction<any>>;
      update: (data?: any) => Promise<Update>;
    }
  | undefined
>(undefined);

export const SessionProvider = ({
  children,
  session,
}: {
  children: any;
  session?: null | Session;
}) => {
  const [currentSession, setSession] = useState<null | Session>(
    session ?? null
  );
  const [status, setStatus] = useState('unauthenticated');

  const getSession = async () => {
    try {
      setStatus('authenticating');
      const resp = await fetch(
        `${
          process.env.NEXT_PUBLIC_FULLAUTH_URL ?? 'http://localhost:3000'
        }/api/auth/session`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await resp.json();
      if (!resp.ok) {
        throw data.error;
      }
      if (data.message === 'No Session') {
        setStatus('unauthenticated');
        setSession(null);
        return null;
      }
      if (!data.session) {
        setStatus('unauthenticated');
        setSession(null);
        return null;
      }
      setStatus('authenticated');
      setSession(data.session);
      return data.session as Session;
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSession();
  }, []);

  async function update(data: any = {}): Promise<Update> {
    const resp = await fetch(
      `${
        process.env.NEXT_PUBLIC_FULLAUTH_URL ?? 'http://localhost:3000'
      }/api/auth/update`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    if (!resp.ok) {
      const data = await resp.json();
      return {
        ok: resp.ok,
        status: resp.status,
        error: data.message,
      };
    }
    await getSession();
  }

  return (
    <sessionContext.Provider
      value={{ session: currentSession, status, update, setSession }}
    >
      {children}
    </sessionContext.Provider>
  );
};
