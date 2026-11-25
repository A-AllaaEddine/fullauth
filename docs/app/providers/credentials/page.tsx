import CodeExample from '@/components/CodeExample';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  path: '/providers/credentials',
  title: 'Credentials provider',
  description: 'Configure FullAuth credentials fields and connect sign-in to your application’s own user and password verification.',
});

const routeHandler = String.raw`import type { AuthOptions } from '@fullauth/core';
import { CredentialsProvider } from '@fullauth/core/providers';
import { NextHandler } from '@fullauth/next';
import { verifyUser } from '@/lib/verify-user'; // App-defined, not a FullAuth export

export const authOptions: AuthOptions = {
  secret: process.env.FULLAUTH_SECRET!,
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'text' },
        password: { type: 'password' },
      },
      async signIn(credentials) {
        return verifyUser(credentials);
      },
    }),
  ],
};

const handler = NextHandler(authOptions);
export { handler as GET, handler as POST };`;

const multipleProviders = String.raw`import { CredentialsProvider } from '@fullauth/core/providers';
import { verifyMember, verifyAdmin } from '@/lib/verify-user'; // App-defined

const providers = [
  CredentialsProvider({
    id: 'member',
    credentials: {
      email: { type: 'text' },
      password: { type: 'password' },
    },
    signIn: verifyMember, // App-defined verifier
  }),
  CredentialsProvider({
    id: 'admin',
    credentials: {
      email: { type: 'text' },
      password: { type: 'password' },
    },
    signIn: verifyAdmin, // App-defined verifier
  }),
];`;

export default function CredentialsProviderPage() {
  return (
    <>
      <p className="docs-breadcrumb">DOCUMENTATION / PROVIDERS</p>
      <h1>Credentials provider</h1>
      <p><code>CredentialsProvider</code> passes submitted fields to an application-provided <code>signIn</code> function. It does not ship a user store, password hashing, registration flow, or email/password policy.</p>

      <section id="route">
        <h2>Configure credentials verification</h2>
        <p>This route example is intentionally partial: <code>verifyUser</code> is your application function. Implement it using your own user store and password-hash verification; return a user object for an accepted login or <code>null</code> for a rejected one.</p>
        <CodeExample filename="app/api/auth/[...fullauth]/route.ts" language="typescript" code={routeHandler} />
      </section>

      <section id="multiple">
        <h2>Configure distinct credential flows</h2>
        <p>Provider IDs are used by the client’s <code>signIn</code> call. Keep each ID unique and implement each verifier in your application.</p>
        <CodeExample filename="Provider entries in authOptions" language="typescript" code={multipleProviders} />
      </section>

      <p>For the built-in Google OAuth module, see the <a href="/providers/google">Google provider guide</a>. No built-in GitHub, Facebook, Apple, or Microsoft provider is included in the current source.</p>
    </>
  );
}
