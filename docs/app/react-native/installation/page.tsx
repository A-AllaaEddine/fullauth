import Link from 'next/link';
import CodeExample from '@/components/CodeExample';
import PackageManagerTabs from '@/components/PackageManagerTabs';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  path: '/react-native/installation',
  title: 'React Native installation',
  description: 'Install the FullAuth React Native helper package, configure its backend origin, and provide the session context to an Expo app.',
});

const app = String.raw`import { SessionProvider } from '@fullauth/react-native';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import Home from './screens/home';

const baseUrl = process.env.EXPO_PUBLIC_FULLAUTH_URL!;

export default function App() {
  return (
    <SessionProvider baseUrl={baseUrl}>
      <View style={{ flex: 1 }}>
        <Home />
        <StatusBar style="auto" />
      </View>
    </SessionProvider>
  );
}`;

export default function ReactNativeInstallation() {
  return (
    <>
      <p className="docs-breadcrumb">DOCUMENTATION / REACT NATIVE</p>
      <h1>React Native installation</h1>
      <p>The published React Native package provides session context and helpers that store session tokens in AsyncStorage. The examples below use Expo; the helper package does not create an Expo project for you.</p>

      <section id="project">
        <h2>Create an Expo project</h2>
        <CodeExample filename="Terminal" language="bash" code="npx create-expo-app my-app" />
      </section>

      <section id="install">
        <h2>Install packages</h2>
        <PackageManagerTabs packages={['@fullauth/core', '@fullauth/react-native']} />
        <p>The package manifest declares React Native and AsyncStorage dependencies/peers. Use a React Native version compatible with the package’s peer requirements.</p>
      </section>

      <section id="environment">
        <h2>Set the backend origin</h2>
        <p>Use the origin of the server that runs the FullAuth route handler. This public URL is not a secret.</p>
        <CodeExample filename=".env" language="bash" code="EXPO_PUBLIC_FULLAUTH_URL=https://auth.example.com" />
      </section>

      <section id="provider">
        <h2>Wrap the app in SessionProvider</h2>
        <p><code>baseUrl</code> is optional in the provider and can fall back to <code>EXPO_PUBLIC_FULLAUTH_URL</code>; passing it explicitly makes the backend origin clear.</p>
        <CodeExample filename="App.tsx" language="tsx" code={app} />
      </section>

      <section id="nextsteps">
        <h2>Next steps</h2>
        <p>Continue with <Link href="/react-native/usage">React Native usage</Link> and the <Link href="/next/installation">Next.js backend setup</Link>. The built-in Google provider’s mobile callback path is present in source, but the included React Native helper does not complete its OAuth redirect flow; see the <Link href="/providers/google">Google provider limitations</Link>.</p>
      </section>
    </>
  );
}
