'use client';

import { Session } from '@lazyauth/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

export const SessionProvider = ({ children }: { children: any }) => {
  const [currentSession, setSession] = useState<null | Session>(null);
  const [status, setStatus] = useState('loading');

  const getSession = async () => {
    try {
      setStatus('loading');
      const token = await AsyncStorage.getItem('lazyauth-session-token');

      if (!token) {
        setSession(null);
        return null;
      }

      const resp = await fetch(
        `${
          process.env.EXPO_PUBLIC_LAZYAUTH_URL ?? 'http://localhost:3000'
        }/api/auth/session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isMobile: true, token }),
        }
      );
      const data = await resp.json();
      if (!resp.ok) {
        throw data.error;
      }
      if (data.message === 'No Session') {
        setSession(null);
        await AsyncStorage.removeItem('lazyauth-session-token');
        await AsyncStorage.removeItem('lazyauth-session-csrf-token');
        return null;
      }
      if (data.message === 'jwt expired') {
        await AsyncStorage.removeItem('lazyauth-session-token');
        await AsyncStorage.removeItem('lazyauth-session-csrf-token');
        return null;
      }
      //   console.log(data);
      if (data.session) {
        setStatus('authenticated');
        setSession(data.session);
      } else {
        setStatus('unauthenticated');
        setSession(null);
        await AsyncStorage.removeItem('lazyauth-session-token');
        await AsyncStorage.removeItem('lazyauth-session-csrf-token');
      }
      return data.session as null | Session;
    } catch (error: any) {
      console.log(error);
      if (error.message === 'jwt expired') {
        await AsyncStorage.removeItem('lazyauth-session-token');
        await AsyncStorage.removeItem('lazyauth-session-csrf-token');
        return null;
      }
      throw error;
    }
  };
  useEffect(() => {
    getSession();
  }, []);

  const update = async (data?: any): Promise<Update> => {
    const token = await AsyncStorage.getItem('lazyauth-session-token');
    if (!token) {
      setSession(null);
      return null;
    }
    const csrfToken = await AsyncStorage.getItem('lazyauth-session-csrf-token');
    const resp = await fetch(
      `${
        process.env.EXPO_PUBLIC_LAZYAUTH_URL ?? 'http://localhost:3000'
      }/api/auth/update`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data, token, csrfToken, isMobile: true }),
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

    const newToken = await resp.json();
    await AsyncStorage.setItem('lazyauth-session-token', newToken.token);
    getSession();
  };

  return (
    <sessionContext.Provider
      value={{
        session: currentSession,
        status,
        update,
        setSession,
      }}
    >
      {children}
    </sessionContext.Provider>
  );
};
