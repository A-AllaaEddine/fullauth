import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ReactNativeInstallation = () => {
  return (
    <div className="flex h-full  gap-2 px-16 py-6  pb-40">
      <div className="w-[calc(100%-16rem)] h-full flex flex-col justify-start items-start  gap-3 ">
        <p className="w-full text-start font-bold text-4xl text-gray-300">
          Installation
        </p>
        <p className="w-full text-start">
          Welcome to the React Native Installation Guide for FullAuth. Follow
          these steps to integrate FullAuth seamlessly into your React Native
          project for a secure and user-friendly authentication experience.
        </p>
        <div
          id="createnewproject"
          className="w-auto h-auto scroll-m-20 flex flex-col justify-start items-start gap-3 mt-10"
        >
          <p className="text-start text-lg text-gray-300">
            Create new project: (we will use expo for this)
          </p>
          <SyntaxHighlighter
            language="javascript"
            style={atomDark}
            customStyle={{ width: '100%', backgroundColor: '#1d1d1d' }}
          >
            npx create-expo-app myApp
          </SyntaxHighlighter>
        </div>
        <div
          id="install"
          className="w-auto h-auto scroll-m-20 flex flex-col justify-start items-start gap-3 mt-10"
        >
          <p className="text-start text-lg text-gray-300">Install Packages:</p>
          <SyntaxHighlighter
            language="javascript"
            style={atomDark}
            customStyle={{ width: '100%', backgroundColor: '#1d1d1d' }}
          >
            npm i @fullauth/core @fullauth/react-native
          </SyntaxHighlighter>
          <p>or</p>
          <SyntaxHighlighter
            language="javascript"
            // customStyle={{ backgroundColor: '#1d1d1d', color: '#fff' }}
            style={atomDark}
            customStyle={{ width: '100%', backgroundColor: '#1d1d1d' }}
          >
            yarn add @fullauth/core @fullauth/react-native
          </SyntaxHighlighter>
        </div>
        <div
          id="environment"
          className="w-auto h-auto scroll-m-20 flex flex-col justify-start items-start gap-3 mt-10"
        >
          <p className="text-start text-lg text-gray-300">
            Add Environment Variables:
          </p>
          <SyntaxHighlighter
            language="javascript"
            style={atomDark}
            customStyle={{ width: '100%', backgroundColor: '#1d1d1d' }}
          >
            EXPO_PUBLIC_FULLAUTH_URL= your-backend-url
          </SyntaxHighlighter>
        </div>
        <div
          id="provider"
          className="w-full h-auto scroll-m-20 flex flex-col justify-start items-start gap-3 mt-10"
        >
          <p className="text-start text-lg text-gray-300">Session Provider:</p>
          <p>
            In order to access the session object on the client side, we need to
            wrap our app with{' '}
            <span className="text-gray-300">SessionProivder</span>{' '}
          </p>
          <div className="w-full h-auto flex flex-col justify-start items-start gap-3 p-3 rounded-xl bg-[#1d1d1d]">
            <p className="w-full h-8 text-start border-b-[1px] border-gray-500">
              App.tsx
            </p>
            <SyntaxHighlighter
              language="javascript"
              // customStyle={{ backgroundColor: '#1d1d1d', color: '#fff' }}
              style={atomDark}
              customStyle={{ width: '100%', backgroundColor: '#1d1d1d' }}
            >
              {`import { SessionProvider } from '@fullauth/react-native';

export default function App() {
  return (
      <SessionProvider  baseUrl= "your-backend-url",>
          // your app code
      </SessionProvider>
  );
}`}
            </SyntaxHighlighter>
          </div>
          <p>
            then in your <span className="text-gray-300">screen.tsx</span> file
            you can call <span className="text-gray-300">useSession()</span>{' '}
            hook to access the session object.
          </p>

          <div>
            <p>
              You can check our{' '}
              <Link href={'/examples'} className="text-blue-500">
                examples
              </Link>{' '}
              for more details.
            </p>
          </div>
        </div>
        <p className="w-full text-start font-bold text-2xl text-gray-300 mt-20">
          Usefull Links
        </p>
        <div className="w-full h-auto flex flex-col justify-start items-start gap-5 rounded-xl bg-[#1d1d1d] p-5">
          <Link
            href={'https://docs.expo.dev/get-started/create-a-project/'}
            className="text-blue-500"
          >
            - Expo Create a project.
          </Link>{' '}
          <Link
            href={
              'https://reactnative.dev/docs/environment-setup?guide=quickstart'
            }
            className="text-blue-500"
          >
            - React Native Docs.
          </Link>
        </div>
      </div>
      <div className="w-56 fixed right-3  h-screen flex flex-col justify-start items-start gap-1 p-2 border-l-[1px] border-gray-600 ">
        <Link
          href={'/react-native/installation#createnewproject'}
          className="p-2 hover:text-gray-300"
        >
          Create new project
        </Link>
        <Link
          href={'/react-native/installation#install'}
          className="p-2 hover:text-gray-300"
        >
          Install Packages
        </Link>
        <Link
          href={'/react-native/installation#environment'}
          className="p-2 hover:text-gray-300"
        >
          Environment Variables
        </Link>
        <Link
          href={'/react-native/installation#provider'}
          className="p-2 hover:text-gray-300"
        >
          Session Provider
        </Link>
      </div>
    </div>
  );
};

export default ReactNativeInstallation;
