import type { JWT, Session } from '@fullauth/core';

declare module '@fullauth/core' {
  interface JWT {
    status?: 'active' | 'banned';
  }
  interface Session {
    status?: 'active' | 'banned';
  }
}
