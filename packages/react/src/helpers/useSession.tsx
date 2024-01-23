'use client';

import { useContext } from 'react';
import { sessionContext } from './context';

const useSession = () => {
  const context = useContext(sessionContext);

  if (!context) {
    throw new Error(
      'Context is not found, make sure you wrap the app with the session provider'
    );
  }

  return {
    status: context.status,
    session: context.session,
    update: context.update,
  };
};

export default useSession;
