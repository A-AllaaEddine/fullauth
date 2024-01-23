import { AuthOptions } from '@fullauth/core';
import { NextHandler } from '@fullauth/next';
import { CredentialProvider } from '@fullauth/core/providers';

export const authOptions: AuthOptions = {
  providers: [
    CredentialProvider({
      name: 'credentials',
      credentials: {
        email: { type: 'text', placeholder: 'Email' },
        password: {
          type: 'password',
          placeholder: 'Password',
        },
      },
      async signIn(credentials) {
        try {
          // you verification logic here

          // throw errors and catch them on the client side
          //     throw new Error('No User');

          return {
            email: credentials.email,
            id: 'test1',
            name: 'test',
          };
        } catch (error: any) {
          console.log(error);
          throw error;
        }
      },
    }),
  ],
  session: {
    // session strategy default to 'token'
    strategry: 'token',
    // you can set the max age of the session
    maxAge: 60 * 60 * 24 * 7,
  },
  // add the secret to encrypt the session
  secret: process.env.FULLAUTH_SECRET!,

  // callbacks runs on sigin and on each session request
  callbacks: {
    async token({ trigger, token, updates, auth, user }) {
      // Initial sign in
      if (auth?.providerType === 'credentials' && user?.email) {
        return {
          ...token,
          user: {
            ...user,
            status: 'active',
          },
        };
      }

      // add the changes coming from the client side to session token
      if (trigger === 'update') {
        token = { ...token, user: { ...token?.user, ...updates } };
      }

      // Return previous token if the access token has not expired yet
      return token;
    },
  },
};

const handler = NextHandler(authOptions);
export { handler as GET, handler as POST };
