import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Typescript = () => {
  return (
    <div className="flex h-full  gap-2 px-16 py-6  pb-40">
      <div className="w-2/3 h-full flex flex-col justify-start items-start  gap-6 ">
        <p className="w-full text-start font-bold text-4xl text-gray-300">
          Typescript
        </p>
        <p className="w-full text-start">
          In this section, we will cover how to leverage TypeScript to enhance
          the development experience while using FullAuth in your web, Next.js,
          React, and React Native applications.
        </p>
        <div
          id="signIn"
          className="w-auto h-auto flex flex-col justify-start items-start gap-3 mt-10"
        >
          <p className="text-start text-lg text-gray-300 font-semibold">
            Module Augmentaion:
          </p>
          <p>
            <span className="text-gray-300">FullAuth</span> supports
            TypeScript's module augmentation, allowing you to extend existing
            types with additional properties or methods
          </p>
          <p>
            Create a <span className="text-gray-300">fullauth.d.ts</span> file
            at the types folder in the root of your project: (Next.js or Expo)
          </p>
          <div className="w-full h-auto flex flex-col justify-start items-start gap-3 p-3 rounded-xl bg-[#1d1d1d]">
            <p className="w-full h-8 text-start border-b-[1px] border-gray-500">
              types/fullauth.d.ts
            </p>
            <SyntaxHighlighter
              language="javascript"
              // customStyle={{ backgroundColor: '#1d1d1d', color: '#fff' }}
              style={atomDark}
              customStyle={{ width: '100%', backgroundColor: '#1d1d1d' }}
            >{`import { JWT, Session } from '@fullauth/core';

// decalre module to extend the library type
declare module '@fullauth/core' {
    // jwt containing the user session (when using token strategy)
  interface JWT {
    user: {
      name: string;
      status: 'active' | 'banned';
    };
  }
  // the session object returned by useSession hook
  interface Session {
    user: {
      name: string;
      status: 'active' | 'banned';
    };
  }
}`}</SyntaxHighlighter>
          </div>
          <p>
            this will cause the default session to be overwritten with the new
            defined one.
          </p>{' '}
          <p>
            If you wish to keep the keep the default session propertie, you must
            merge them with the new props:
          </p>
          <div className="w-full h-auto flex flex-col justify-start items-start gap-3 p-3 rounded-xl bg-[#1d1d1d]">
            <p className="w-full h-8 text-start border-b-[1px] border-gray-500">
              types/fullauth.d.ts
            </p>
            <SyntaxHighlighter
              language="javascript"
              // customStyle={{ backgroundColor: '#1d1d1d', color: '#fff' }}
              style={atomDark}
              customStyle={{ width: '100%', backgroundColor: '#1d1d1d' }}
            >{`import { JWT, Session, DefaultSession, DefaultJWT } from '@fullauth/core';

// decalre module to extend the library type
declare module '@fullauth/core' {
    // jwt containing the user session (when using token strategy)
  interface JWT {
    user: {
      name: string;
      status: 'active' | 'banned';
    } & DefaultJWT["user"]
  }
  // the session object returned by useSession hook
  interface Session {
    user: {
      name: string;
      status: 'active' | 'banned';
    } & DefaultSession["user]
  }
}`}</SyntaxHighlighter>
          </div>
        </div>
        <p className="w-full text-start font-bold text-2xl text-gray-300 mt-20">
          Usefull Links
        </p>
        <div className="w-full h-auto flex flex-col justify-start items-start gap-5 rounded-xl bg-[#1d1d1d] p-5">
          <Link
            href={
              'https://www.digitalocean.com/community/tutorials/typescript-module-augmentation'
            }
            className="text-blue-500"
          >
            - Typescript Module Augmentation.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Typescript;
