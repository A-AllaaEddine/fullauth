'use client';

import { useContext } from 'react';
import { sessionContext } from './context';

/**
 * React hook that return session object, update fucntion and auth status
 *
 * @returns {session} The session object.
 * @returns {status} The authentication status.
 * @returns {update} Fucntion to update the session object.
 * @throws {AuthenticationError} If error occurs, return error object.
 */
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
