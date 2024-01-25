import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const NextInstallation = () => {
  return (
    <div className="flex h-full  gap-2 px-16 py-6  pb-40">
      <div className="w-[calc(100%-16rem)] h-full flex flex-col justify-start items-start  gap-3 ">
        <p className="w-full text-start font-bold text-4xl text-gray-300">
          Installation
        </p>
        <p className="w-full text-start">
          Welcome to the Next.js Installation Guide for FullAuth. Follow these
          steps to integrate FullAuth seamlessly into your Next.js project for a
          secure and user-friendly authentication experience.
        </p>
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
            npm i @fullauth/core @fullauth/next @fullauth/react
          </SyntaxHighlighter>
          <p>or</p>
          <SyntaxHighlighter
            language="javascript"
            style={atomDark}
            customStyle={{ width: '100%', backgroundColor: '#1d1d1d' }}
          >
            yarn add @fullauth/core @fullauth/next @fullauth/react
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
            NEXT_PUBLIC_FULLAUTH_URL= your-backend-url
          </SyntaxHighlighter>
        </div>
        <div
          id="routehandler"
          className="w-full h-auto scroll-m-20 flex flex-col justify-start items-start gap-3 mt-10"
        >
          <p className="text-start text-lg text-gray-300">
            Create Route Handler:
          </p>
          <p>
            In your Nextjs App directory, create a{' '}
            <span className="text-gray-300">route.ts</span> file inside{' '}
            <span className="text-gray-300">app/api/auth/[...fullauth] </span>
            folder{' '}
          </p>
          <div className="w-full h-auto flex flex-col justify-start items-start gap-3 p-3 rounded-xl bg-[#1d1d1d]">
            <p className="w-full h-8 text-start border-b-[1px] border-gray-500">
              app/api/auth/[...fullauth]/route.ts
            </p>
            <SyntaxHighlighter
              language="javascript"
              // customStyle={{ backgroundColor: '#1d1d1d', color: '#fff' }}
              style={atomDark}
              customStyle={{ width: '100%', backgroundColor: '#1d1d1d' }}
            >
              {`import { AuthOptions } from '@fullauth/core';
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

  // add the secret to encrypt the session
  secret: process.env.FULLAUTH_SECRET!,

 
};

const handler = NextHandler(authOptions);
export { handler as GET, handler as POST };`}
            </SyntaxHighlighter>
          </div>
          <p>
            All requests to /api/auth/* will automatically be handled by
            FullAuth.
          </p>
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
              app/layout.tsx
            </p>
            <SyntaxHighlighter
              language="javascript"
              // customStyle={{ backgroundColor: '#1d1d1d', color: '#fff' }}
              style={atomDark}
              customStyle={{ width: '100%', backgroundColor: '#1d1d1d' }}
            >
              {`import { SessionProvider } from '@fullauth/react';
import { getSession } from '@fullauth/next/helpers';
import { authOptions } from './api/auth/[...fullauth]/route';

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // you need to pass the handler option to getSession to get the session on the server
    const session = await getSession(authOptions);
    return (
    <html lang="en">
        <body >
        <SessionProvider session={session}>{children}</SessionProvider>
        </body>
    </html>
    );
}
            `}
            </SyntaxHighlighter>
          </div>
          <p>
            then in your <span className="text-gray-300">page.tsx</span> file
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
          <Link href={'https://nextjs.org/docs'} className="text-blue-500">
            - Next.js Docs.
          </Link>
        </div>
      </div>
      <div className="w-56 fixed right-3  h-screen flex flex-col justify-start items-start gap-1 p-2 border-l-[1px] border-gray-600 ">
        <Link
          href={'/next/installation#install'}
          className="p-2 hover:text-gray-300"
        >
          Install Packages
        </Link>
        <Link
          href={'/next/installation#environment'}
          className="p-2 hover:text-gray-300"
        >
          Environment Variables
        </Link>
        <Link
          href={'/next/installation#routehandler'}
          className="p-2 hover:text-gray-300"
        >
          Create Route Handler
        </Link>
        <Link
          href={'/next/installation#provider'}
          className="p-2 hover:text-gray-300"
        >
          Session Provider
        </Link>
      </div>
    </div>
  );
};

export default NextInstallation;
