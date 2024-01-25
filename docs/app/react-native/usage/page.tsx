import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
const Usage = () => {
  return (
    <div className="flex h-full  gap-2 px-16 py-6  pb-40">
      <div className="w-[calc(100%-16rem)] h-full flex flex-col justify-start items-start  gap-2 ">
        <p className="w-full text-start font-bold text-4xl text-gray-300">
          Usage
        </p>
        <p className="w-full text-start">
          In this section, you will find detailed instructions on how to
          integrate FullAuth into your React Native App. Follow the steps below
          to set up authentication, manage user sessions, and utilize the key
          features of FullAuth.
        </p>
        <div
          id="signin"
          className="w-full h-auto scroll-m-20 flex flex-col justify-start items-start gap-3 mt-10"
        >
          <p className="text-start text-lg text-gray-300 font-semibold">
            signIn:
          </p>
          <p>
            use <span className="text-gray-300">signIn()</span> method to create
            a session for the user:
          </p>
          <div className="w-full h-auto flex flex-col justify-start items-start gap-3 p-3 rounded-xl bg-[#1d1d1d]">
            <p className="w-full h-8 text-start border-b-[1px] border-gray-500">
              screen.tsx
            </p>
            <SyntaxHighlighter
              language="javascript"
              // customStyle={{ backgroundColor: '#1d1d1d', color: '#fff' }}
              style={atomDark}
              customStyle={{ width: '100%', backgroundColor: '#1d1d1d' }}
            >{`import { signIn } from '@fullauth/react-native';

export default function Screen() {
  return (
      <View>
          <Pressable
          onPress={async () =>
              await signIn('credentials', {
                email: 'test@test.com',
                password: 'test12345',
              })
          }
          >
          <Text>Sign In</Text>
          </Pressable>
      </View>
  );
}`}</SyntaxHighlighter>
          </div>
        </div>
        <div
          id="signout"
          className="w-full h-auto scroll-m-20 flex flex-col justify-start items-start gap-5 mt-10"
        >
          <p className="text-start text-lg text-gray-300 font-semibold">
            signOut:
          </p>
          <p>
            use <span className="text-gray-300">signOut()</span> method to
            delete the session:
          </p>
          <div className="w-full h-auto flex flex-col justify-start items-start gap-3 p-3 rounded-xl bg-[#1d1d1d]">
            <p className="w-full h-8 text-start border-b-[1px] border-gray-500">
              screen.tsx
            </p>
            <SyntaxHighlighter
              language="typescript"
              // customStyle={{ backgroundColor: '#1d1d1d', color: '#fff' }}
              style={atomDark}
              customStyle={{ width: '100%', backgroundColor: '#1d1d1d' }}
            >{`import { signOut } from '@fullauth/react-native';

export default function Screen() {
    return (
        <View>
            <Pressable
            onPress={async () => await signOut()}
            >
            <Text>Sign Out</Text>
            </Pressable>
        </View>
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
            To access the session object in a component, you can use{' '}
            <span className="text-gray-300">useSession()</span> hook:
          </p>
          <div className="w-full h-auto flex flex-col justify-start items-start gap-3 p-3 rounded-xl bg-[#1d1d1d]">
            <p className="w-full h-8 text-start border-b-[1px] border-gray-500">
              screen.tsx
            </p>
            <SyntaxHighlighter
              language="javascript"
              // customStyle={{ backgroundColor: '#1d1d1d', color: '#fff' }}
              style={atomDark}
              customStyle={{ width: '100%', backgroundColor: '#1d1d1d' }}
            >{`import { useSession } from '@fullauth/react-native';

export default function Screen() {
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
            the session:
          </p>
          <div className="w-full h-auto flex flex-col justify-start items-start gap-3 p-3 rounded-xl bg-[#1d1d1d]">
            <p className="w-full h-8 text-start border-b-[1px] border-gray-500">
              screen.tsx
            </p>
            <SyntaxHighlighter
              language="javascript"
              // customStyle={{ backgroundColor: '#1d1d1d', color: '#fff' }}
              style={atomDark}
              customStyle={{ width: '100%', backgroundColor: '#1d1d1d' }}
            >{`import { singOut } from '@fullauth/react';

export default function Screen() {
  return (
    <View>
        <Pressable
        onPress={async () =>
            await update({
                name: 'lazydev',
            })
        }
        >
            <Text>Update</Text>
        </Pressable>
    </View>
  );
}`}</SyntaxHighlighter>
          </div>
        </div>
        <div
          id="authheaders"
          className="w-auto h-auto scroll-m-20 flex flex-col justify-start items-start gap-5 mt-10"
        >
          <p className="text-start text-lg text-gray-300 font-semibold">
            authHeaders:
          </p>
          <p>
            To verify user idendity on the backend, we must add the{' '}
            <span className="text-gray-300">authHeaders</span> give us access to
            the session object on the backend when calling{' '}
            <span className="text-gray-300">getSession()</span> :
          </p>
          <p
            id="fetch"
            className="text-start scroll-m-20 text-lg text-gray-300 font-semibold"
          >
            fetch:
          </p>
          <div className="w-full h-auto flex flex-col justify-start items-start gap-3 p-3 rounded-xl bg-[#1d1d1d]">
            <p className="w-full h-8 text-start border-b-[1px] border-gray-500">
              screen.tsx
            </p>
            <SyntaxHighlighter
              language="javascript"
              // customStyle={{ backgroundColor: '#1d1d1d', color: '#fff' }}
              style={atomDark}
              customStyle={{ width: '100%', backgroundColor: '#1d1d1d' }}
            >
              {`import { authHeaders } from '@fullauth/react-native';

await fetch(\`${process.env.EXPO_PUBLIC_FULLAUTH_URL}/your/api/route\`, {
method: 'POST',
headers: {
    ...authHeaders,
},
body: JSON.stringify(data)
})`}
            </SyntaxHighlighter>
          </div>
          <p
            id="trpc"
            className="text-start scroll-m-20 text-lg text-gray-300 font-semibold"
          >
            trpc:
          </p>
          <p>
            If you are using trpc, you can add{' '}
            <span className="text-gray-300">authHeaders</span> to trpcClient in
            your TrpcProvider as below:
          </p>
          <div className="w-full h-auto flex flex-col justify-start items-start gap-3 p-3 rounded-xl bg-[#1d1d1d]">
            <p className="w-full h-8 text-start border-b-[1px] border-gray-500">
              TrpcProvder.tsx
            </p>
            <SyntaxHighlighter
              language="javascript"
              // customStyle={{ backgroundColor: '#1d1d1d', color: '#fff' }}
              style={atomDark}
              customStyle={{ width: '100%', backgroundColor: '#1d1d1d' }}
            >
              {`import { authHeaders } from '@fullauth/react-native';

export default function TrpcProvider({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const [queryClient] = useState(() => new QueryClient({}));
    const [trpcClient] = useState(() =>
      trpc.createClient({
        transformer: superjson,
        links: [
          httpBatchLink({
            url: \`your-server-url/api/trpc\`,
            headers: {
                ...authHeaders,
            },
          }),
        ],
      })
    );
    return (
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </trpc.Provider>
    );
  }`}
            </SyntaxHighlighter>
          </div>

          <p>
            Then in you backend, make sure to add the request object to{' '}
            <span className="text-gray-300">getSession()</span> method to access
            those headers:
          </p>
          <p className="text-start text-lg text-gray-300 font-semibold">
            Next Route Handler:
          </p>
          <div className="w-full h-auto flex flex-col justify-start items-start gap-3 p-3 rounded-xl bg-[#1d1d1d]">
            <p className="w-full h-8 text-start border-b-[1px] border-gray-500">
              route.ts
            </p>
            <SyntaxHighlighter
              language="javascript"
              // customStyle={{ backgroundColor: '#1d1d1d', color: '#fff' }}
              style={atomDark}
              customStyle={{ width: '100%', backgroundColor: '#1d1d1d' }}
            >
              {`import { getSession } from '@fullauth/next/helpers';

const handler = async (req: Request) => {
    try {
      const session = await getSession(req, authOptions);
      if (!session.user) {
        return NextResponse.json({ ok: false, message: 'Unauthorised' });
      }
  
      // you code here

      return NextResponse.json({ ok: true, imgData: imgData.data });
    } catch (error: any) {
      return NextResponse.json({ ok: false, message: error.message });
    }
  };
  
export { handler as POST };`}
            </SyntaxHighlighter>
          </div>
          <p className="text-start text-lg text-gray-300 font-semibold">
            Trpc Context:
          </p>
          <div className="w-full h-auto flex flex-col justify-start items-start gap-3 p-3 rounded-xl bg-[#1d1d1d]">
            <p className="w-full h-8 text-start border-b-[1px] border-gray-500">
              context.ts
            </p>
            <SyntaxHighlighter
              language="javascript"
              // customStyle={{ backgroundColor: '#1d1d1d', color: '#fff' }}
              style={atomDark}
              customStyle={{ width: '100%', backgroundColor: '#1d1d1d' }}
            >
              {`import { getSession } from '@fullauth/next/helpers';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export const createContext = async (opts: FetchCreateContextFnOptions) => {
    const session = await getSession(opts?.req, authOptions);
    return {
      session,
    };
  };
  
export type Context = inferAsyncReturnType<typeof createContext>;`}
            </SyntaxHighlighter>
          </div>
        </div>
        <p className="w-full text-start font-bold text-2xl text-gray-300 mt-20">
          Usefull Links
        </p>
        <div className="w-full h-auto flex flex-col justify-start items-start gap-5 rounded-xl bg-[#1d1d1d] p-5">
          <Link
            href={'https://trpc.io/docs/server/context'}
            className="text-blue-500"
          >
            - Trpc Context.
          </Link>
          <Link
            href={
              'https://nextjs.org/docs/app/building-your-application/routing/route-handlers'
            }
            className="text-blue-500"
          >
            - Next.js Route Handler.
          </Link>
        </div>
      </div>
      <div className="w-64 fixed right-3  h-screen flex flex-col justify-start items-start gap-1 p-2 border-l-[1px] border-gray-600 ">
        <Link
          href={'/react-native/usage#signin'}
          className="p-2 hover:text-gray-300"
        >
          signIn()
        </Link>
        <Link
          href={'/react-native/usage#signout'}
          className="p-2 hover:text-gray-300"
        >
          signOut()
        </Link>
        <Link
          href={'/react-native/usage#usesession'}
          className="p-2 hover:text-gray-300"
        >
          useSession()
        </Link>
        <Link
          href={'/react-native/usage#update'}
          className="p-2 hover:text-gray-300"
        >
          update()
        </Link>
        <Link
          href={'/react-native/usage#authheaders'}
          className="p-2 hover:text-gray-300"
        >
          authHeaders
        </Link>
        <div className="w-full h-auto flex flex-col justify-start items-start gap-2 px-3">
          <Link
            href={'/react-native/usage#fetch'}
            className="p-2 text-sm hover:text-gray-300"
          >
            fetch
          </Link>
          <Link
            href={'/react-native/usage#trpc'}
            className="p-2 text-sm hover:text-gray-300"
          >
            trpc
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Usage;
