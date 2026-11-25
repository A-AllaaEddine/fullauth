import type { Metadata } from 'next';
import './globals.css';
import DocsFrame from '@/components/DocsFrame';

export const metadata: Metadata = {
  metadataBase: new URL('https://full-auth.vercel.app'),
  title: { default: 'FullAuth — TypeScript authentication for web and mobile', template: '%s | FullAuth' },
  description: 'A TypeScript authentication library with credentials and Google provider modules, a Next.js route handler, and React and React Native session helpers.',
  applicationName: 'FullAuth',
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png', sizes: '64x64' },
    ],
  },
  openGraph: {
    title: 'FullAuth — TypeScript authentication for web and mobile',
    description: 'Credentials and Google provider modules, a Next.js route handler, and React and React Native session helpers.',
    siteName: 'FullAuth',
    type: 'website',
    locale: 'en_US',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FullAuth — TypeScript authentication for web and mobile',
    description: 'Credentials and Google provider modules, a Next.js route handler, and React and React Native session helpers.',
    images: ['/opengraph-image'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: `(()=>{try{const t=localStorage.getItem('fullauth-theme');document.documentElement.dataset.theme=t==='light'||t==='dark'?t:'system'}catch{document.documentElement.dataset.theme='system'}})()` }} /></head><body><DocsFrame>{children}</DocsFrame></body></html>;
}
