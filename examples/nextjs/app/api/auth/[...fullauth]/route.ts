import { AuthOptions } from "@fullauth/core";
import { CredentialsProvider } from "@fullauth/core/providers";
import { NextHandler } from "@fullauth/next";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { type: "text", placeholder: "Email" },
        password: {
          type: "password",
          placeholder: "Password",
        },
      },
      async signIn(credentials) {
        try {
          // you verification logic here

          // throw errors and catch them on the client side
          // throw new CustomError('No User', {
          //   name: 'John Doe',
          // });

          return {
            email: credentials.email,
            id: "test1",
            name: "test",
          };
        } catch (error: any) {
          // console.log(error);
          throw error;
        }
      },
    }),
  ],
  session: {
    // session strategy default to 'token'
    strategy: "token",
    // you can set the max age of the session
    maxAge: 60 * 60 * 24 * 7,
  },
  // add the secret to encrypt the session
  secret: process.env.FULLAUTH_SECRET!,

  // callbacks runs on sigin and on each session request
  callbacks: {
    async token({ trigger, token, updates, auth, user, platform }) {
      // Initial sign in
      if (auth?.providerType === "credentials" && user?.email) {
        token = {
          ...token,
          user: {
            name: "john doe",
            status: "active",
          },
        };
      }

      // add the changes coming from the client side to session token
      if (trigger === "update") {
        token = { ...token, user: { ...token?.user, ...updates } };
      }

      // Return previous token if the access token has not expired yet
      return token;
    },
  },
};

const handler = NextHandler(authOptions);
export { handler as GET, handler as POST };
