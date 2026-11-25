'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/components/header';
import SideTab from '@/components/SideTab';
import DocsNavigation from '@/components/DocsNavigation';

export default function DocsFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname === '/') return;
    const blocks = Array.from(document.querySelectorAll<HTMLElement>('.docs-content pre'));
    const buttons = blocks.map((pre) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'code-copy';
      button.textContent = 'Copy';
      button.setAttribute('aria-label', 'Copy code');
      button.onclick = async () => {
        const code = pre.querySelector('code')?.innerText ?? pre.innerText;
        try {
          if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
          await navigator.clipboard.writeText(code);
          button.textContent = 'Copied';
          button.setAttribute('aria-label', 'Code copied');
        } catch {
          const textarea = document.createElement('textarea');
          textarea.value = code;
          textarea.setAttribute('readonly', '');
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.append(textarea);
          textarea.select();
          const copied = document.execCommand('copy');
          textarea.remove();
          button.textContent = copied ? 'Copied' : 'Copy failed';
          button.setAttribute('aria-label', copied ? 'Code copied' : 'Copy failed');
        }
        window.setTimeout(() => { button.textContent = 'Copy'; button.setAttribute('aria-label', 'Copy code'); }, 1800);
      };
      pre.classList.add('code-frame');
      const language = pre.querySelector('code')?.className.match(/language-([\w-]+)/)?.[1];
      if (language) pre.dataset.language = language;
      pre.append(button);
      return button;
    });
    return () => buttons.forEach((button) => button.remove());
  }, [pathname]);
  if (pathname === '/') return <>{children}</>;
  return <><a className="skip-link" href="#main-content">Skip to content</a><div className="docs-shell"><Header/><SideTab/><main id="main-content" className="docs-main"><div className="docs-grid"><article className="docs-content">{children}</article><DocsNavigation/></div></main></div></>;
}
