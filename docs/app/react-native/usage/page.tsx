import CodeExample from '@/components/CodeExample';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  path: '/react-native/usage',
  title: 'React Native usage',
  description: 'Use FullAuth credential sign-in, sign-out, session state, updates, and authentication headers in a React Native app.',
});

const signIn = String.raw`import { signIn } from '@fullauth/react-native';
import { Pressable, Text } from 'react-native';

const baseUrl = process.env.EXPO_PUBLIC_FULLAUTH_URL!;

export default function SignInButton({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  return (
    <Pressable
      onPress={() =>
        signIn({
          baseUrl,
          provider: 'credentials',
          credentials: { email, password },
        })
      }
    >
      <Text>Sign in</Text>
    </Pressable>
  );
}`;

const signOut = String.raw`import { signOut } from '@fullauth/react-native';
import { Pressable, Text } from 'react-native';

const baseUrl = process.env.EXPO_PUBLIC_FULLAUTH_URL!;

export default function SignOutButton() {
  return (
    <Pressable onPress={() => signOut({ baseUrl })}>
      <Text>Sign out</Text>
    </Pressable>
  );
}`;

const useSession = String.raw`import { useSession } from '@fullauth/react-native';
import { Text } from 'react-native';

export default function SessionStatus() {
  const { session, status } = useSession();

  return <Text>{session?.user?.email ?? status}</Text>;
}`;

const update = String.raw`import { useSession } from '@fullauth/react-native';
import { Pressable, Text } from 'react-native';

export default function RenameSession() {
  const { update } = useSession();

  return (
    <Pressable onPress={() => update({ name: 'New name' })}>
      <Text>Update session</Text>
    </Pressable>
  );
}`;

const authHeaders = String.raw`import { authHeaders } from '@fullauth/react-native';

export async function loadPrivateProfile() {
  const baseUrl = process.env.EXPO_PUBLIC_FULLAUTH_URL!;
  const response = await fetch(
    baseUrl + '/api/profile',
    { headers: await authHeaders() },
  );
  return response.json();
}`;

const apiRoute = String.raw`import { getServerSession } from '@fullauth/next/helpers';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...fullauth]/route';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions.secret!, request);
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ user: session.user });
}`;

const trpcContext = String.raw`import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { getServerSession } from '@fullauth/next/helpers';
import { authOptions } from '../api/auth/[...fullauth]/route';

export async function createContext(opts: FetchCreateContextFnOptions) {
  const session = await getServerSession(authOptions.secret!, opts.req);
  return { session };
}

export type Context = Awaited<ReturnType<typeof createContext>>;`;

export default function ReactNativeUsage() {
  return (
    <>
      <p className="docs-breadcrumb">DOCUMENTATION / REACT NATIVE</p>
      <h1>React Native usage</h1>
      <p>Wrap the app in <code>SessionProvider</code> as shown in the installation guide. The helpers use the configured backend origin and store the mobile session token and CSRF token in AsyncStorage.</p>

      <section id="signin">
        <h2>Sign in with credentials</h2>
        <p>Connect <code>email</code> and <code>password</code> to your app’s form values. The server-side credentials provider is responsible for verification.</p>
        <CodeExample filename="screens/SignInButton.tsx" language="tsx" code={signIn} />
      </section>

      <section id="signout">
        <h2>Sign out</h2>
        <p>The React Native helper requires the backend <code>baseUrl</code> and removes the stored session token and CSRF token.</p>
        <CodeExample filename="screens/SignOutButton.tsx" language="tsx" code={signOut} />
      </section>

      <section id="usesession">
        <h2>Read session state</h2>
        <CodeExample filename="screens/SessionStatus.tsx" language="tsx" code={useSession} />
      </section>

      <section id="update">
        <h2>Update session data</h2>
        <p>Updates are sent to the server and passed to <code>callbacks.token</code>. The application callback must validate and apply accepted values; the default callback does not merge arbitrary data.</p>
        <CodeExample filename="screens/RenameSession.tsx" language="tsx" code={update} />
      </section>

      <section id="authheaders">
        <h2>Send authentication headers</h2>
        <p><code>authHeaders()</code> returns the stored token and CSRF token. Forward them to a backend route that validates the session.</p>
        <CodeExample filename="screens/profile.ts" language="typescript" code={authHeaders} />
      </section>

      <section id="fetch">
        <h2>Read the session in a Next.js route</h2>
        <p>The helper’s request overload reads the authentication headers in the current Next.js request context.</p>
        <CodeExample filename="app/api/profile/route.ts" language="typescript" code={apiRoute} />
      </section>

      <section id="trpc">
        <h2>Use with tRPC</h2>
        <p>This is a partial context example for an app that already uses tRPC. FullAuth does not include a tRPC adapter.</p>
        <CodeExample filename="server/context.ts" language="typescript" code={trpcContext} />
      </section>

      <p>Google OAuth in a React Native client is not established by the mobile callback URL alone. The included helper currently does not open or complete the OAuth redirect; see the <a href="/providers/google">provider limitations</a>.</p>
    </>
  );
}
