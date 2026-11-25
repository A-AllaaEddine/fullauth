'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Search as SearchIcon, X } from 'lucide-react';
import searchIndex from '@/lib/search.json';

type SearchEntry = {
  id: number;
  name: string;
  redirect: string;
  title: string;
  content: string;
  kind: 'page' | 'heading';
};

const entries = searchIndex as SearchEntry[];
const fold = (value: string) => value.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const compact = (value: string) => fold(value).replace(/\s+/g, '');
const editable = (target: EventTarget | null) => target instanceof HTMLElement && (target.isContentEditable || Boolean(target.closest('input,textarea,select,[contenteditable="true"]')));

function scoreEntry(entry: SearchEntry, query: string) {
  const q = fold(query);
  const qCompact = compact(query);
  const tokens = q.split(/\s+/).filter(Boolean);
  if (!q) return 0;
  const title = fold(entry.title);
  const name = fold(entry.name);
  const path = fold(entry.redirect.replace('#', ' '));
  const content = fold(entry.content);
  const fields = [title, name, path, content];
  if (!tokens.every((token) => fields.some((field) => field.includes(token)))) return 0;
  let score = 0;
  if (compact(entry.name).includes(qCompact)) score += 100;
  if (compact(entry.title).includes(qCompact)) score += 80;
  if (compact(entry.redirect).includes(qCompact)) score += 40;
  if (compact(entry.content).includes(qCompact)) score += 10;
  if (entry.kind === 'heading' && (compact(entry.name).includes(qCompact) || compact(entry.title).includes(qCompact))) score += 30;
  for (const token of tokens) {
    if (title.includes(token)) score += 12;
    if (name.includes(token)) score += 16;
    if (content.includes(token)) score += 2;
  }
  return score;
}

export default function SearchModal() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [shortcutLabel, setShortcutLabel] = useState('Ctrl K');
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return entries.map((entry) => ({ entry, score: scoreEntry(entry, q) }))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || (a.entry.kind === b.entry.kind ? 0 : a.entry.kind === 'heading' ? -1 : 1) || a.entry.name.localeCompare(b.entry.name))
      .slice(0, 18)
      .map(({ entry }) => entry);
  }, [query]);

  useEffect(() => {
    setShortcutLabel(/Mac/i.test(navigator.platform) ? '⌘ K' : 'Ctrl K');
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || (!event.metaKey && !event.ctrlKey) || event.key.toLowerCase() !== 'k') return;
      if (editable(event.target)) return;
      event.preventDefault();
      previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setOpen(true);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const timer = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(timer);
  }, [open]);

  useEffect(() => {
    if (open) setActiveIndex(0);
  }, [open, query]);

  function close() {
    setOpen(false);
    setQuery('');
    window.requestAnimationFrame(() => {
      const target = previousFocus.current;
      if (target?.isConnected) target.focus();
      else triggerRef.current?.focus();
    });
  }

  function openSearch() {
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setOpen(true);
  }

  function choose(entry = results[activeIndex]) {
    if (!entry) return;
    close();
    router.push(entry.redirect);
  }

  function handleDialogKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      close();
      return;
    }
    if (event.key === 'ArrowDown' && results.length) {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
      return;
    }
    if (event.key === 'ArrowUp' && results.length) {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
      return;
    }
    if (event.key === 'Enter' && results.length) {
      event.preventDefault();
      choose();
      return;
    }
    if (event.key === 'Tab' && dialogRef.current) {
      const focusables = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled]),a[href]'));
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialogRef.current.contains(document.activeElement))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialogRef.current.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    }
  }

  return <>
    <button ref={triggerRef} type="button" className="docs-search-trigger" aria-label="Search documentation" onClick={openSearch}>
      <SearchIcon aria-hidden="true" size={16}/><span>Search documentation</span><kbd>{shortcutLabel}</kbd>
    </button>
    {open && createPortal(<div className="search-overlay" onPointerDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <div ref={dialogRef} className="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-title" aria-describedby="search-help" onKeyDown={handleDialogKeyDown}>
        <div className="search-dialog-heading">
          <div><h2 id="search-title">Search documentation</h2><p id="search-help">Find a setup guide, provider, or API topic.</p></div>
          <button type="button" className="search-close" aria-label="Close search" onClick={close}><X size={18}/></button>
        </div>
        <label className="sr-only" htmlFor="docs-search">Search documentation</label>
        <input ref={inputRef} id="docs-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search pages and topics…" className="search-input" role="combobox" aria-expanded="true" aria-controls="search-results" aria-autocomplete="list" aria-activedescendant={results[activeIndex] ? `search-option-${results[activeIndex].id}` : undefined}/>
        <div className="search-results" id="search-results" role="listbox" aria-label="Search results" aria-live="polite">
          {!query.trim() && <p className="search-empty">Type a page title, section, provider, or API name.</p>}
          {query.trim() && results.length === 0 && <p className="search-empty">No matching topics. Try a framework or API name.</p>}
          {results.map((entry, index) => {
            const pathname = entry.redirect.split('#')[0];
            const category = pathname.startsWith('/react-native') ? 'React Native' : pathname.startsWith('/next') ? 'Next.js' : pathname.startsWith('/providers') ? 'Providers' : pathname === '/typescript' ? 'Reference' : pathname === '/examples' ? 'Examples' : 'Start here';
            return <a key={entry.id} id={`search-option-${entry.id}`} role="option" aria-selected={index === activeIndex} href={entry.redirect} className={`search-result ${index === activeIndex ? 'selected' : ''}`} onMouseMove={() => setActiveIndex(index)} onClick={(event) => { event.preventDefault(); choose(entry); }}><span>{entry.name}</span><small>{category} · {entry.title}</small></a>;
          })}
        </div>
        <p className="search-shortcuts"><kbd>↑</kbd><kbd>↓</kbd> to navigate <kbd>Enter</kbd> to open <kbd>Esc</kbd> to close</p>
      </div>
    </div>, document.body)}
  </>;
}
