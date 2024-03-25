'use client';

import { Session } from '@fullauth/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react';
import { authHeaders } from './authHeader';

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
      baseUrl?: string;
    }
  | undefined
>(undefined);

export const SessionProvider = ({
  children,
  baseUrl,
}: {
  children: any;
  baseUrl?: string;
}) => {
  const [currentSession, setSession] = useState<null | Session>(null);
  const [status, setStatus] = useState('unauthenticated');

  const getSession = async () => {
    try {
      // setStatus('authenticating');
      // const token = await AsyncStorage.getItem('fullauth-session-token');

      // if (!token) {
      //   setSession(null);
      //   return null;
      // }

      const resp = await fetch(
        `${
          baseUrl ??
          process.env.EXPO_PUBLIC_FULLAUTH_URL ??
          'http://localhost:3000'
        }/api/auth/mobile/session`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(await authHeaders()),
          },
        }
      );
      const data = await resp.json();
      if (!resp.ok) {
        throw data.error;
      }
      if (data.message === 'No Session') {
        setSession(null);
        await AsyncStorage.removeItem('fullauth-session-token');
        await AsyncStorage.removeItem('fullauth-session-csrf-token');
        return null;
      }
      if (data.message === 'jwt expired') {
        await AsyncStorage.removeItem('fullauth-session-token');
        await AsyncStorage.removeItem('fullauth-session-csrf-token');
        return null;
      }
      //   console.log(data);
      if (!data.session) {
        setStatus('unauthenticated');
        setSession(null);
        await AsyncStorage.removeItem('fullauth-session-token');
        await AsyncStorage.removeItem('fullauth-session-csrf-token');
        return null;
      }
      setStatus('authenticated');
      setSession(data.session);
      return data.session as null | Session;
    } catch (error: any) {
      console.log(error);
      if (error.message === 'jwt expired') {
        await AsyncStorage.removeItem('fullauth-session-token');
        await AsyncStorage.removeItem('fullauth-session-csrf-token');
        return null;
      }
      throw error;
    }
  };
  useEffect(() => {
    getSession();
  }, []);

  const update = async (data: any = {}): Promise<Update> => {
    const token = await AsyncStorage.getItem('fullauth-session-token');
    if (!token) {
      setSession(null);
      return null;
    }
    const resp = await fetch(
      `${
        baseUrl ??
        process.env.EXPO_PUBLIC_FULLAUTH_URL ??
        'http://localhost:3000'
      }/api/auth/mobile/update`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(await authHeaders()),
        },
        body: JSON.stringify(data),
      }
    );

    const returnData = await resp.json();
    if (!resp.ok) {
      return {
        ok: resp.ok,
        status: returnData.status,
        error: returnData.message,
      };
    }

    // const newToken = await resp.json();
    await AsyncStorage.setItem('fullauth-session-token', returnData.token);
    await getSession();
  };

  return (
    <sessionContext.Provider
      value={{
        session: currentSession,
        status,
        update,
        setSession,
        baseUrl,
      }}
    >
      {children}
    </sessionContext.Provider>
  );
};
