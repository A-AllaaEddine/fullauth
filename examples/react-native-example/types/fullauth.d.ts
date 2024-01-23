import { JWT, Session } from '@fullauth/core';

// decalre module to extend the library type
declare module '@fullauth/core' {
  interface JWT {
    user: {
      name: string;
      status: 'active' | 'banned';
    };
  }
  interface Session {
    user: {
      name: string;
      status: 'active' | 'banned';
    };
  }
}
