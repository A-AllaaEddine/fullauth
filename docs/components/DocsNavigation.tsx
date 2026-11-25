'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const pages = [
  ['/introduction', 'Introduction'], ['/installation', 'Installation'],
  ['/next/installation', 'Next.js setup'], ['/next/usage', 'Next.js usage'],
  ['/react-native/installation', 'React Native setup'], ['/react-native/usage', 'React Native usage'],
  ['/providers/credentials', 'Credentials provider'], ['/providers/google', 'Google provider'],
  ['/examples', 'Examples'], ['/typescript', 'TypeScript'], ['/changelog', 'Changelog'],
] as const;

type TocEntry = { id: string; label: string; level: number };

function slug(text: string) {
  return text.toLocaleLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'section';
}

export default function DocsNavigation() {
  const pathname = usePathname();
  const [entries, setEntries] = useState<TocEntry[]>([]);
  const [active, setActive] = useState('');

  useEffect(() => {
    const article = document.querySelector<HTMLElement>('.docs-content');
    if (!article) return;
    const candidates = Array.from(article.querySelectorAll<HTMLElement>(
      'h2, h3, h4'
    ));
    const seen = new Set<string>();
    const nextEntries: TocEntry[] = [];

    for (const heading of candidates) {
      const label = heading.innerText.trim();
      if (!label || heading.closest('.docs-navigation')) continue;
      let target = heading;
      if (!heading.id) {
        let parent = heading.parentElement;
        while (parent && parent !== article) {
          if (parent.id) {
            target = parent;
            break;
          }
          parent = parent.parentElement;
        }
      }
      if (!target.id) target.id = slug(label);
      if (seen.has(target.id)) continue;
      seen.add(target.id);
      const level = Number(heading.tagName.slice(1));
      nextEntries.push({ id: target.id, label, level });
    }

    const initialState = window.setTimeout(() => {
      setEntries(nextEntries);
      if (nextEntries[0]) setActive(nextEntries[0].id);
    }, 0);
    const targets = nextEntries.map(({ id }) => document.getElementById(id)).filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver((records) => {
      const visible = records.filter((record) => record.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]?.target instanceof HTMLElement) setActive(visible[0].target.id);
    }, { rootMargin: '-12% 0px -72% 0px', threshold: 0 });
    targets.forEach((target) => observer.observe(target));
    return () => { window.clearTimeout(initialState); observer.disconnect(); };
  }, [pathname]);

  const index = pages.findIndex(([href]) => href === pathname);
  const previous = index > 0 ? pages[index - 1] : undefined;
  const next = index >= 0 && index < pages.length - 1 ? pages[index + 1] : undefined;

  return (
    <>
      {entries.length > 0 && <aside className="docs-toc" aria-label="On this page">
        <p className="docs-toc-title">On this page</p>
        <nav>{entries.map((entry) => <a key={entry.id} className={`${entry.level > 2 ? 'nested' : ''} ${active === entry.id ? 'active' : ''}`} href={`#${entry.id}`} aria-current={active === entry.id ? 'location' : undefined}>{entry.label}</a>)}</nav>
      </aside>}
      {(previous || next) && <nav className="docs-pagination" aria-label="Article navigation">
        {previous ? <Link href={previous[0]} rel="prev"><span>Previous</span><strong>← {previous[1]}</strong></Link> : <span/>}
        {next ? <Link href={next[0]} rel="next"><span>Next</span><strong>{next[1]} →</strong></Link> : <span/>}
      </nav>}
    </>
  );
}
