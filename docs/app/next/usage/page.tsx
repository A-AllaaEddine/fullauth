import CodeExample from '@/components/CodeExample';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  path: '/next/usage',
  title: 'Next.js usage',
  description: 'Use FullAuth sign-in, sign-out, session hooks, update callbacks, and the Next.js server session helper.',
});

const signIn = String.raw`'use client';

import { signIn } from '@fullauth/react';

export default function SignInButton({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  return (
    <button
      onClick={() =>
        signIn('credentials', { credentials: { email, password } })
      }
    >
      Sign in
    </button>
  );
}`;

const signOut = String.raw`'use client';

import { signOut } from '@fullauth/react';

export default function SignOutButton() {
  return <button onClick={() => signOut()}>Sign out</button>;
}`;

const useSession = String.raw`'use client';

import { useSession } from '@fullauth/react';

export default function SessionStatus() {
  const { session, status } = useSession();
  const label = session?.user?.email ?? status;

  return <p>{label}</p>;
}`;

const update = String.raw`'use client';

import { useSession } from '@fullauth/react';

export default function RenameSession() {
  const { update } = useSession();

  return (
    <button onClick={() => update({ name: 'New name' })}>
      Update session
    </button>
  );
}`;

const getServerSession = String.raw`import { getServerSession } from '@fullauth/next/helpers';
import { authOptions } from '../api/auth/[...fullauth]/route';

export default async function AccountPage() {
  const session = await getServerSession(authOptions.secret!);
  return <p>{session?.user?.email ?? 'Signed out'}</p>;
}`;

const overloads = String.raw`import type { Session } from '@fullauth/core';
import type { NextRequest } from 'next/server';

declare function getServerSession(secret: string): Promise<Session | null>;
declare function getServerSession(
  secret: string,
  req: Request | NextRequest,
): Promise<Session | null>;`;

export default function NextUsage() {
  return (
    <>
      <p className="docs-breadcrumb">DOCUMENTATION / NEXT.JS</p>
      <h1>Next.js usage</h1>
      <p>The React helpers are client-side APIs. Wrap the app in the <code>SessionProvider</code> shown in the <a href="/next/installation">installation guide</a> before calling <code>useSession</code>.</p>

      <section id="signin">
        <h2>Sign in with credentials</h2>
        <p>The example receives form values as props. Connect those props to your own form; credentials verification runs in the application callback configured on the server.</p>
        <CodeExample filename="app/components/SignInButton.tsx" language="tsx" code={signIn} />
      </section>

      <section id="signout">
        <h2>Sign out</h2>
        <CodeExample filename="app/components/SignOutButton.tsx" language="tsx" code={signOut} />
      </section>

      <section id="usesession">
        <h2>Read the client session</h2>
        <CodeExample filename="app/components/SessionStatus.tsx" language="tsx" code={useSession} />
      </section>

      <section id="update">
        <h2>Update session data</h2>
        <p><code>update(data)</code> sends the data to the server. The application’s <code>callbacks.token</code> callback receives it in <code>updates</code>; validate and merge only the fields your app intends to accept. The default callback does not merge arbitrary update data into the token.</p>
        <CodeExample filename="app/components/RenameSession.tsx" language="tsx" code={update} />
      </section>

      <section id="getsession">
        <h2>Read a session on the server</h2>
        <p><code>getServerSession</code> accepts the configured secret and returns a session or <code>null</code>. It can also be called with a request in the helper’s overload.</p>
        <CodeExample filename="app/account/page.tsx" language="tsx" code={getServerSession} />
        <CodeExample filename="TypeScript signatures" language="typescript" code={overloads} />
      </section>
    </>
  );
}
