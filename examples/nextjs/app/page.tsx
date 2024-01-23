'use client';

import { signIn, signOut, useSession } from '@fullauth/react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { update, session } = useSession();
  const router = useRouter();
  console.log('session: ', session);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full h-full flex flex-col justify-center items-center my-4">
        <p className="text-white text-xl">user: {session?.user?.name ?? ''}</p>
        <p className="text-white text-xl">
          status: {session?.user?.status ?? ''}
        </p>
      </div>
      <div className="w-auto h-auto flex flex-col justify-center items-center gap-5">
        <button
          className="bg-red-500 w-auth h-10 rounded-lg p-2 font-bold"
          onClick={async () => {
            await signIn('credentials', {
              email: 'test@test.com',
              password: 'test12345',
            });
            router.refresh();
          }}
        >
          Sign In
        </button>
        <button
          className="bg-red-500 w-auth h-10 rounded-lg p-2 font-bold"
          onClick={async () => {
            await update({
              name: 'lazydev',
            });
          }}
        >
          Update
        </button>
        <button
          className="bg-red-500 w-auth h-10 rounded-lg p-2 font-bold"
          onClick={async () => {
            await signOut();
            router.refresh();
          }}
        >
          Sign Out
        </button>
      </div>
    </main>
  );
}
