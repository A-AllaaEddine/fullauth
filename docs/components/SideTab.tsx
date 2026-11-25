'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import LogoMark from '@/components/LogoMark';

const groups = [
  { label: 'START HERE', links: [['Introduction', '/introduction'], ['Installation', '/installation']] },
  { label: 'INTEGRATIONS', links: [['Next.js setup', '/next/installation'], ['Next.js usage', '/next/usage'], ['React Native setup', '/react-native/installation'], ['React Native usage', '/react-native/usage']] },
  { label: 'PROVIDERS', links: [['Credentials', '/providers/credentials'], ['Google', '/providers/google']] },
  { label: 'REFERENCE', links: [['Examples', '/examples'], ['TypeScript', '/typescript'], ['Changelog', '/changelog']] },
];

export default function SideTab() {
 const path = usePathname();
 const [open, setOpen] = useState(false);
 const trigger = useRef<HTMLButtonElement>(null);
 const navigation = useRef<HTMLElement>(null);
 useEffect(() => {
   if (open) navigation.current?.querySelector<HTMLAnchorElement>('a')?.focus();
 }, [open]);
 useEffect(() => {
   const onKeyDown = (event: KeyboardEvent) => {
     if (event.key === 'Escape' && open) {
       setOpen(false);
       trigger.current?.focus();
     }
   };
   window.addEventListener('keydown', onKeyDown);
   return () => window.removeEventListener('keydown', onKeyDown);
 }, [open]);
 return <><button ref={trigger} className="mobile-menu" aria-expanded={open} aria-controls="docs-navigation" onClick={()=>setOpen(!open)}>{open?'Close':'Menu'}</button>{open&&<button className="nav-backdrop" aria-label="Close navigation" onClick={()=>setOpen(false)}/>}<aside ref={navigation} id="docs-navigation" className={`docs-side ${open?'mobile-open':''}`} aria-label="Documentation navigation"><Link href="/" className="docs-side-brand" onClick={()=>setOpen(false)}><LogoMark className="brand-symbol"/><span>fullauth</span></Link>{groups.map(group=><details key={group.label} className="docs-nav-group" open><summary>{group.label}</summary>{group.links.map(([name,href])=><Link key={href} href={href} className={path===href?'active':''} aria-current={path===href?'page':undefined} onClick={()=>setOpen(false)}>{name}</Link>)}</details>)}</aside></>;
}
