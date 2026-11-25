'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SearchModal from './SearchModal';
import ThemeControl from './ThemeControl';
import GitHubLink from './GitHubLink';
import LogoMark from './LogoMark';

export default function Header() {
  const pathname = usePathname();
  const current = pathname === '/introduction' ? 'Introduction' : pathname === '/installation' ? 'Installation' : pathname.startsWith('/react-native') ? `React Native / ${pathname.endsWith('usage') ? 'Usage' : 'Setup'}` : pathname.startsWith('/next') ? `Next.js / ${pathname.endsWith('usage') ? 'Usage' : 'Setup'}` : pathname.startsWith('/providers') ? `Providers / ${pathname.split('/').at(-1)}` : pathname.slice(1) || 'Documentation';
  return <header className="docs-header"><Link href="/" className="wordmark"><LogoMark className="brand-symbol"/> <span>fullauth</span> <span className="docs-breadcrumb">/ DOCS / {current}</span></Link><div className="docs-head-space"/><SearchModal/><ThemeControl/><GitHubLink className="docs-github"/></header>;
}
