import CodeExample from '@/components/CodeExample';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  path: '/typescript',
  title: 'TypeScript types',
  description: 'Use FullAuth’s exported session and JWT types, and add application-specific fields with compatible TypeScript module augmentation.',
});

const augmentation = String.raw`import '@fullauth/core';

declare module '@fullauth/core' {
  interface JWT {
    tenantId?: string;
  }

  interface Session {
    tenantId?: string;
  }
}`;

export default function TypeScriptGuide() {
  return (
    <>
      <p className="docs-breadcrumb">DOCUMENTATION / REFERENCE</p>
      <h1>TypeScript types</h1>
      <p><code>@fullauth/core</code> exports the <code>AuthOptions</code>, <code>JWT</code>, <code>Session</code>, <code>DefaultJWT</code>, and <code>DefaultSession</code> types used by the framework packages.</p>

      <section id="augmentation">
        <h2>Add application-specific fields</h2>
        <p>This example adds optional top-level fields without redeclaring the existing <code>user</code> properties. Put it in a declaration file included by your TypeScript project.</p>
        <CodeExample filename="types/fullauth.d.ts" language="typescript" code={augmentation} />
        <p>Module augmentation changes compile-time types only. To populate a custom JWT field at runtime, return it from your configured token callback. The callback must validate user-supplied updates before adding values to a token.</p>
      </section>
    </>
  );
}
