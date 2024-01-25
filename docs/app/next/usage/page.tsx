import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Usage = () => {
  return (
    <div className="flex h-full  gap-2 px-16 py-6  pb-40">
      <div className="w-[calc(100%-16rem)] h-full flex flex-col justify-start items-start  gap-3 ">
        <p className="w-full text-start font-bold text-4xl text-gray-300">
          Usage
        </p>
        <p className="w-full text-start">
          In this section, you will find detailed instructions on how to
          integrate FullAuth into your Next.js App. Follow the steps below to
          set up authentication, manage user sessions, and utilize the key
          features of FullAuth.
        </p>
        <div
          id="signin"
          className="w-full h-auto scroll-m-20  flex flex-col justify-start items-start gap-3 mt-10"
        >
          <p className="text-start text-lg text-gray-300 font-semibold">
            signIn:
          </p>
          <p>
            use <span className="text-gray-300">signIn()</span> method to create
            a session for the user: (client side only)
          </p>
          <div className="w-full h-auto flex flex-col justify-start items-start gap-3 p-3 rounded-xl bg-[#1d1d1d]">
            <p className="w-full h-8 text-start border-b-[1px] border-gray-500">
              app/page.tsx
            </p>
            <SyntaxHighlighter
              language="javascript"
              // customStyle={{ backgroundColor: '#1d1d1d', color: '#fff' }}
              style={atomDark}
              customStyle={{ width: '100%', backgroundColor: '#1d1d1d' }}
            >{`'use client';

import { signIn } from '@fullauth/react';

export default function Home() {
    return (
        <div>
            <button
            onClick={async () =>
                await signIn('credentials', {
                  email: 'test@test.com',
                  password: 'test12345',
                })
            }
            ></button>
        </div>
    );
}`}</SyntaxHighlighter>
          </div>
        </div>
        <div
          id="singout"
          className="w-full h-auto scroll-m-20 flex flex-col justify-start items-start gap-5 mt-10"
        >
          <p className="text-start text-lg text-gray-300 font-semibold">
            signOut:
          </p>
          <p>
            use <span className="text-gray-300">signOut()</span> method to
            delete the session: (client side only)
          </p>
          <div className="w-full h-auto flex flex-col justify-start items-start gap-3 p-3 rounded-xl bg-[#1d1d1d]">
            <p className="w-full h-8 text-start border-b-[1px] border-gray-500">
              app/page.tsx
            </p>
            <SyntaxHighlighter
              language="javascript"
              // customStyle={{ backgroundColor: '#1d1d1d', color: '#fff' }}
              style={atomDark}
              customStyle={{ width: '100%', backgroundColor: '#1d1d1d' }}
            >{`'use client';

import { singOut } from '@fullauth/react';

export default function Home() {
    return (
        <div>
          <button onClick={async () => await signOut()}></button>
        </div>
    );
}`}</SyntaxHighlighter>
          </div>
        </div>
        <div
          id="usesession"
          className="w-full h-auto scroll-m-20 flex flex-col justify-start items-start gap-5 mt-10"
        >
          <p className="text-start text-lg text-gray-300 font-semibold">
            useSession:
          </p>
          <p>
            To access the session object in a client component, you can use{' '}
            <span className="text-gray-300">useSession()</span> hook:
          </p>
          <div className="w-full h-auto flex flex-col justify-start items-start gap-3 p-3 rounded-xl bg-[#1d1d1d]">
            <p className="w-full h-8 text-start border-b-[1px] border-gray-500">
              app/page.tsx
            </p>
            <SyntaxHighlighter
              language="javascript"
              // customStyle={{ backgroundColor: '#1d1d1d', color: '#fff' }}
              style={atomDark}
              customStyle={{ width: '100%', backgroundColor: '#1d1d1d' }}
            >{`'use client';

import { useSession } from '@fullauth/react';

export default function Home() {
    const {  session } = useSession();
    console.log('session: ', session);

    return (
   /// your page code here
    );
}`}</SyntaxHighlighter>
          </div>
        </div>
        <div
          id="update"
          className="w-full h-auto scroll-m-20 flex flex-col justify-start items-start gap-5 mt-10"
        >
          <p className="text-start text-lg text-gray-300 font-semibold">
            update:
          </p>
          <p>
            use <span className="text-gray-300">udpate()</span> method to update
            the session: (client side only)
          </p>
          <div className="w-full h-auto flex flex-col justify-start items-start gap-3 p-3 rounded-xl bg-[#1d1d1d]">
            <p className="w-full h-8 text-start border-b-[1px] border-gray-500">
              app/page.tsx
            </p>
            <SyntaxHighlighter
              language="javascript"
              // customStyle={{ backgroundColor: '#1d1d1d', color: '#fff' }}
              style={atomDark}
              customStyle={{ width: '100%', backgroundColor: '#1d1d1d' }}
            >{`'use client';

import { singOut } from '@fullauth/react';

export default function Home() {
    return (
        <div>
          <button
            onClick={async () =>
              await update({
                name: 'lazydev',
              })
            }
          ></button>
        </div>
    );
}`}</SyntaxHighlighter>
          </div>
        </div>
        <div
          id="getsession"
          className="w-full h-auto scroll-m-20 flex flex-col justify-start items-start gap-5 mt-10"
        >
          <p className="text-start text-lg text-gray-300 font-semibold">
            getSession:
          </p>
          <p>
            To access the session object in a server component (server-side),
            you can use <span className="text-gray-300">geetSession()</span>{' '}
            method:
          </p>
          <div className="w-full h-auto flex flex-col justify-start items-start gap-3 p-3 rounded-xl bg-[#1d1d1d]">
            <p className="w-full h-8 text-start border-b-[1px] border-gray-500">
              app/page.tsx
            </p>
            <SyntaxHighlighter
              language="javascript"
              // customStyle={{ backgroundColor: '#1d1d1d', color: '#fff' }}
              style={atomDark}
              customStyle={{ width: '100%', backgroundColor: '#1d1d1d' }}
            >{`import { getSession } from '@fullauth/next/helpers';
import { authOptions } from '../api/auth/[...fullauth]/route';

const Server = () => {
  const session = getSession(authOptions);
  return (
    <div>
      <div>
        <p>user: {session?.user?.name}</p>
      </div>
    </div>
  );
};

export default Server;`}</SyntaxHighlighter>
          </div>
          <p>
            <span className="text-gray-300">getSession()</span> has two
            overeloads:{' '}
          </p>
          <div className="w-full h-auto flex flex-col justify-start items-start gap-3 p-3 rounded-xl bg-[#1d1d1d]">
            <p className="w-full h-8 text-start border-b-[1px] border-gray-500">
              app/page.tsx
            </p>

            <SyntaxHighlighter
              language="javascript"
              // customStyle={{ backgroundColor: '#1d1d1d', color: '#fff' }}
              style={atomDark}
              customStyle={{ width: '100%', backgroundColor: '#1d1d1d' }}
            >
              {`function getServerSession(options: AuthOptions): Promise<Session | null>;

function getServerSession(
  req: Request | NextRequest,
  options: AuthOptions
): Promise<Session | null>;`}
            </SyntaxHighlighter>
          </div>
          <p>
            The first overload of getSession (passing the AuthOptions only) is
            the default implementation when you only have web apps, while the
            second overload is particularly useful when FullAuth needs to
            extract authentication-related information from the request object
            (ex: headers). Especially when you have a react native app using the
            same backend.
          </p>
        </div>
      </div>
      <div className="w-56 fixed right-3  h-screen flex flex-col justify-start items-start gap-1 p-2 border-l-[1px] border-gray-600 ">
        <Link href={'/next/usage#signIn'} className="p-2 hover:text-gray-300">
          signIn()
        </Link>
        <Link href={'/next/usage#singout'} className="p-2 hover:text-gray-300">
          signOutt()
        </Link>
        <Link
          href={'/next/usage#usesesion'}
          className="p-2 hover:text-gray-300"
        >
          useSession()
        </Link>
        <Link href={'/next/usage#update'} className="p-2 hover:text-gray-300">
          update()
        </Link>
        <Link
          href={'/next/usage#getsession'}
          className="p-2 hover:text-gray-300"
        >
          getSession()
        </Link>
      </div>
    </div>
  );
};

export default Usage;
