import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/header';
import SideTab from '@/components/SideTab';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FullAuth',
  description:
    'FullAuth, a versatile authentication library designed to streamline user authentication and authorization across a variety of platforms. Whether you are developing web applications, Next.js projects, React applications, or React Native mobile apps, FullAuth offers a unified and secure authentication experience.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="bg-[#0f0f0f] min-h-screen  text-gray-400">
          <Header />
          <div className="w-full  h-full flex justify-center items-start ">
            <SideTab />
            <div className="w-full h-full ml-60 overflow-y-auto pt-14">
              {children}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
