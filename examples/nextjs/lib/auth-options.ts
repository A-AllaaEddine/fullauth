import type { AuthOptions } from '@fullauth/core';
import { CredentialsProvider } from '@fullauth/core/providers';

export const authOptions: AuthOptions = {
  secret: process.env.FULLAUTH_SECRET!,
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'text' },
        password: { type: 'password' },
      },
      async signIn(credentials) {
        // Replace with app-owned user lookup and password-hash verification.
        // Returning null keeps this scaffold from accepting a fake account.
        void credentials;
        return null;
      },
    }),
  ],
  session: { strategy: 'token', maxAge: 60 * 60 * 24 * 7 },
  callbacks: {
    async token({ trigger, token, updates, auth, user }) {
      if (auth?.providerType === 'credentials' && user?.email && token) {
        token = { ...token, status: 'active' };
      }
      if (trigger === 'update' && token && typeof updates?.name === 'string') {
        token = { ...token, user: { ...token.user, name: updates.name } };
      }
      return token;
    },
  },
};
