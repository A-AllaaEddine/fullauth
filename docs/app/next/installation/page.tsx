import Link from 'next/link';
import CodeExample from '@/components/CodeExample';
import PackageManagerTabs from '@/components/PackageManagerTabs';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  path: '/next/installation',
  title: 'Next.js installation',
  description: 'Install FullAuth for a Next.js App Router project, configure credentials, and add the route handler and React session provider.',
});

const routeHandler = String.raw`import type { AuthOptions } from '@fullauth/core';
import { CredentialsProvider } from '@fullauth/core/providers';
import { NextHandler } from '@fullauth/next';
import { verifyUser } from '@/lib/verify-user'; // App-defined credential verification

export const authOptions: AuthOptions = {
  secret: process.env.FULLAUTH_SECRET!,
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'text' },
        password: { type: 'password' },
      },
      async signIn(credentials) {
        // Implement verifyUser against your user store and password-hash scheme.
        return verifyUser(credentials);
      },
    }),
  ],
};

const handler = NextHandler(authOptions);
export { handler as GET, handler as POST };`;

const layout = String.raw`import type { ReactNode } from 'react';
import { getServerSession } from '@fullauth/next/helpers';
import { SessionProvider } from '@fullauth/react';
import { authOptions } from './api/auth/[...fullauth]/route';

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const session = await getServerSession(authOptions.secret!);

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}`;

export default function NextInstallation() {
  return (
    <>
      <p className="docs-breadcrumb">DOCUMENTATION / NEXT.JS</p>
      <h1>Next.js installation</h1>
      <p>FullAuth’s Next.js package exports an App Router handler and a server session helper. The React package supplies the client session context and hooks used by the examples below.</p>

      <section id="install">
        <h2>Install packages</h2>
        <PackageManagerTabs packages={['@fullauth/core', '@fullauth/next', '@fullauth/react']} />
      </section>

      <section id="environment">
        <h2>Set the backend URL and secret</h2>
        <p><code>NEXT_PUBLIC_FULLAUTH_URL</code> is the public origin used by the browser client to reach the Next.js backend. Set <code>FULLAUTH_SECRET</code> on the server. Keep the secret out of client code and source control.</p>
        <CodeExample filename=".env.local" language="bash" code={`NEXT_PUBLIC_FULLAUTH_URL=https://auth.example.com\nFULLAUTH_SECRET=replace-with-a-long-random-secret`} />
      </section>

      <section id="routehandler">
        <h2>Create the route handler</h2>
        <p>The credential verifier is app-specific. It must check the submitted credentials against your own user store and return a user object or <code>null</code>; FullAuth does not provide a user database or password-hashing implementation.</p>
        <CodeExample filename="app/api/auth/[...fullauth]/route.ts" language="typescript" code={routeHandler} />
      </section>

      <section id="provider">
        <h2>Provide the session to React</h2>
        <p>The React <code>SessionProvider</code> accepts an optional initial session. The Next.js guide uses <code>getServerSession</code> to read it in the root layout.</p>
        <CodeExample filename="app/layout.tsx" language="tsx" code={layout} />
      </section>

      <section id="nextsteps">
        <h2>Next steps</h2>
        <p>Continue with <Link href="/next/usage">Next.js usage</Link>, or review the separate <Link href="/providers/credentials">credentials</Link> and <Link href="/providers/google">Google provider</Link> guides. The Google guide describes source-backed configuration and its current verification limits.</p>
      </section>
    </>
  );
}
