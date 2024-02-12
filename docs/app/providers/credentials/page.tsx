import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Credentials = () => {
  return (
    <div className="flex h-full  gap-2 px-16 py-6  pb-40">
      <div className="w-[calc(100%-16rem)] h-full flex flex-col justify-start items-start  gap-3 ">
        <p className="w-full text-start font-bold text-4xl text-gray-300">
          Credentials Provider
        </p>
        <p className="w-full text-start">
          In this section, you will find detailed instructions on how to use
          Credentials Provider with FullAuth.
        </p>
        <div
          id="route"
          className="w-full h-auto scroll-m-20  flex flex-col justify-start items-start gap-3 mt-10"
        >
          <p className="text-start text-lg text-gray-300 font-semibold">
            Route Handler:
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
            >{`import { AuthOptions } from '@fullauth/core';
import { NextHandler } from '@fullauth/next';
import { CredentialsProvider } from '@fullauth/core/providers';

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
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
    
    // Rest of code
};

const handler = NextHandler(authOptions);
export { handler as GET, handler as POST };`}</SyntaxHighlighter>
          </div>
        </div>
        <div
          id="multiple"
          className="w-full h-auto scroll-m-20  flex flex-col justify-start items-start gap-3 mt-10"
        >
          <p className="text-start text-lg text-gray-300 font-semibold">
            Multiple Providers:
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
            >{`import { AuthOptions } from '@fullauth/core';
import { NextHandler } from '@fullauth/next';
import { CredentialsProvider } from '@fullauth/core/providers';

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials-user',
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
          CredentialsProvider({
            id: 'credentials-admin',
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
    
    // Rest of code
};

const handler = NextHandler(authOptions);
export { handler as GET, handler as POST };`}</SyntaxHighlighter>
          </div>
        </div>
      </div>
      <div className="w-56 fixed right-3  h-screen flex flex-col justify-start items-start gap-1 p-2 border-l-[1px] border-gray-600 ">
        <Link
          href={'/providers/credentials#route'}
          className="p-2 hover:text-gray-300"
        >
          Route Handler
        </Link>
        <Link
          href={'/providers/credentials#multiple'}
          className="p-2 hover:text-gray-300"
        >
          Multiple Providers
        </Link>
      </div>
    </div>
  );
};

export default Credentials;
