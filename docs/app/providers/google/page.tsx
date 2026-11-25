import Link from 'next/link';
import CodeExample from '@/components/CodeExample';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  path: '/providers/google',
  title: 'Google OAuth provider',
  description: 'Configure the built-in Google OAuth provider in FullAuth and review its callback paths and current verification limits.',
});

const configuration = String.raw`import type { AuthOptions } from '@fullauth/core';
import { GoogleProvider } from '@fullauth/core/providers';
import { NextHandler } from '@fullauth/next';

export const authOptions: AuthOptions = {
  secret: process.env.FULLAUTH_SECRET!,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
};

const handler = NextHandler(authOptions);
export { handler as GET, handler as POST };`;

export default function GoogleProviderPage() {
  return (
    <>
      <p className="docs-breadcrumb">DOCUMENTATION / PROVIDERS</p>
      <h1>Google OAuth provider</h1>
      <p>The source includes a built-in <code>GoogleProvider</code> for the Next.js handler. It requests the <code>openid email profile</code> scopes, exchanges the callback code with Google, and reads the user profile from Google’s userinfo endpoint.</p>

      <section id="configuration">
        <h2>Configure the provider</h2>
        <p>Create OAuth client credentials with Google and store the client secret and FullAuth secret on the server. Keep the public backend origin in <code>NEXT_PUBLIC_FULLAUTH_URL</code>; the provider appends its callback path to that origin.</p>
        <CodeExample filename="app/api/auth/[...fullauth]/route.ts" language="typescript" code={configuration} />
      </section>

      <section id="redirects">
        <h2>Register callback URLs</h2>
        <p>Register the exact callback URL that matches your backend origin. The source builds these paths:</p>
        <ul>
          <li>Web: <code>{'${NEXT_PUBLIC_FULLAUTH_URL}/api/auth/callback/google'}</code></li>
          <li>Mobile callback path in the provider source: <code>{'${NEXT_PUBLIC_FULLAUTH_URL}/api/auth/callback/mobile/google'}</code></li>
        </ul>
        <p>See Google’s <Link href="https://developers.google.com/identity/protocols/oauth2" target="_blank" rel="noreferrer">OAuth documentation</Link> and register the callback URL in the Google Cloud OAuth client configuration.</p>
      </section>

      <section id="limitations">
        <h2>Verification limits</h2>
        <ul>
          <li>The repository contains a Google provider module; this audit did not run a live OAuth flow with registered Google credentials.</li>
          <li>The React Native helper does not open or complete the OAuth redirect response returned by the server. The presence of a mobile callback path does not establish working Google sign-in in a React Native app.</li>
          <li>In the current source, OAuth <code>state</code> carries the requested redirect URL and the callback decodes it. The callback does not compare it with a generated, stored one-time value. Have this flow reviewed before using Google sign-in with live users.</li>
          <li>No built-in GitHub, Facebook, Apple, or Microsoft provider module is present. The generic provider types do not mean those integrations are included.</li>
        </ul>
      </section>

      <p>Use the <Link href="/providers/credentials">credentials guide</Link> for the application-provided credentials verifier.</p>
    </>
  );
}
