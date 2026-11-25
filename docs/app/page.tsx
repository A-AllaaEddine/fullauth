'use client';

import Link from 'next/link';
import { useState } from 'react';
import ThemeControl from '@/components/ThemeControl';
import SearchModal from '@/components/SearchModal';
import GitHubLink from '@/components/GitHubLink';
import LogoMark from '@/components/LogoMark';

const clients = {
  'Next.js': ['@fullauth/next', 'Route handler + server session helpers', 'Server'],
  React: ['@fullauth/react', 'Session context + sign-in and session hooks', 'Client'],
  'React Native': ['@fullauth/react-native', 'Session helpers + auth headers', 'Mobile'],
};

export default function Home() {
  const [active, setActive] = useState<keyof typeof clients>('Next.js');
  const [copied, setCopied] = useState<'idle' | 'copied' | 'failed'>('idle');
  const copy = async () => {
    const command = `npm install @fullauth/core ${clients[active][0]}${active === 'Next.js' ? ' @fullauth/react' : ''}`;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(command);
      setCopied('copied');
    } catch {
      const input = document.createElement('textarea');
      input.value = command;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.append(input);
      input.select();
      setCopied(document.execCommand('copy') ? 'copied' : 'failed');
      input.remove();
    }
    window.setTimeout(() => setCopied('idle'), 1800);
  };

  return <main className="home">
    <nav className="home-nav"><Link href="/" className="wordmark"><LogoMark className="brand-symbol"/><span>fullauth</span></Link><div><SearchModal/><Link href="/introduction">Docs</Link><Link href="/examples">Examples</Link><GitHubLink/><ThemeControl/></div></nav>
    <section className="hero">
      <div className="hero-copy"><p className="eyebrow"><span className="live-dot"/> AUTHENTICATION, SHARED ACROSS YOUR STACK</p><h1>One auth core.<br/><em>Every surface.</em></h1><p className="lede">FullAuth is a TypeScript authentication library with integrations for Next.js, React, and React Native. Configure providers once, then connect the clients your app needs.</p><div className="hero-actions"><Link className="button primary" href="/introduction">Read the docs <span>↗</span></Link><Link className="button secondary" href="https://github.com/A-AllaaEddine/fullauth" target="_blank">View on GitHub</Link></div><p className="hero-note">Open source · TypeScript · Web + mobile packages</p></div>
      <div id="architecture" className="architecture" aria-label="Interactive FullAuth architecture diagram"><div className="arch-top"><span>PACKAGE MAP</span><span>01 / 03</span></div><div className="core-node"><span className="node-icon"><LogoMark className="brand-symbol" inverse/></span><div><strong>@fullauth/core</strong><small>providers · tokens · shared types</small></div><span className="node-status">CORE</span></div><div className="connector"><i/><i/><i/></div><div className="client-list">{Object.keys(clients).map(name => { const key = name as keyof typeof clients; return <button key={name} onClick={() => setActive(key)} aria-pressed={active === key} className={`client-node ${active === key ? 'selected' : ''}`}><span className="client-dot"/><span>{name}</span><span className="node-arrow">↗</span></button> })}</div><div className="arch-detail"><div><small>SELECTED INTEGRATION</small><strong>{clients[active][0]}</strong><span>{clients[active][1]}</span></div><b>{clients[active][2]}</b></div><div className="arch-caption"><span>Shared configuration</span><span className="caption-line"/><span>Platform integrations</span></div></div>
    </section>
    <section id="quickstart" className="quickstart"><div className="section-index">01 <span>— QUICK START</span></div><div className="quick-copy"><h2>Start with the<br/>surface you ship.</h2><p>Install the core and the integration for your runtime. Follow the guide for setup details and supported APIs.</p><Link href="/installation" className="text-link">Choose an installation guide <span>→</span></Link></div><div className="install-panel"><div className="panel-head"><span><i/> TERMINAL</span><button onClick={copy} aria-label="Copy install command" aria-live="polite">{copied === 'copied' ? 'Copied ✓' : copied === 'failed' ? 'Copy failed' : 'Copy'}</button></div><div className="install-code"><span className="prompt">$</span> npm install @fullauth/core<br/><span className="prompt">›</span> {clients[active][0]}{active === 'Next.js' ? ' @fullauth/react' : ''}</div><div className="framework-tabs">{Object.keys(clients).map(n => <button key={n} className={active === n ? 'current' : ''} aria-pressed={active === n} onClick={() => setActive(n as keyof typeof clients)}>{n}</button>)}</div></div></section>
    <section className="principles"><div className="section-index">02 <span>— THE MODEL</span></div><div className="principle"><span className="principle-no">A</span><div><h3>Providers define sign-in.</h3><p>Configure credentials in the shared core. The credentials provider accepts your application’s verification logic.</p></div><code>CredentialsProvider()</code></div><div className="principle"><span className="principle-no">B</span><div><h3>Adapters connect runtimes.</h3><p>Next.js handles auth routes and server session access. React and React Native expose client session utilities.</p></div><code>getServerSession() · useSession()</code></div><div className="principle"><span className="principle-no">C</span><div><h3>Verify the fit in the docs.</h3><p>Review package-specific setup, examples, and current limitations before integrating.</p></div><Link href="/introduction" className="text-link">Explore docs →</Link></div></section>
    <footer className="home-footer"><Link href="/" className="wordmark"><LogoMark className="brand-symbol"/><span>fullauth</span></Link><span>Authentication primitives for your application.</span><div><Link href="/introduction">Documentation</Link><Link href="/examples">Examples</Link><Link href="https://github.com/A-AllaaEddine/fullauth">GitHub ↗</Link></div></footer>
  </main>;
}
