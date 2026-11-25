'use client';

import { useId, useState } from 'react';
import type { KeyboardEvent } from 'react';

type Manager = 'npm' | 'Yarn' | 'pnpm';
const managers: Manager[] = ['npm', 'Yarn', 'pnpm'];

export default function PackageManagerTabs({ packages }: { packages: string[] }) {
  const [manager, setManager] = useState<Manager>('npm');
  const id = useId();
  const command = `${manager === 'npm' ? 'npm install' : manager === 'Yarn' ? 'yarn add' : 'pnpm add'} ${packages.join(' ')}`;

  function moveTab(event: KeyboardEvent<HTMLButtonElement>) {
    const current = managers.indexOf(manager);
    let next = current;
    if (event.key === 'ArrowRight') next = (current + 1) % managers.length;
    else if (event.key === 'ArrowLeft') next = (current + managers.length - 1) % managers.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = managers.length - 1;
    else return;
    event.preventDefault();
    setManager(managers[next]);
    document.getElementById(`${id}-${managers[next]}`)?.focus();
  }

  return <div className="package-manager">
    <div role="tablist" aria-label="Package manager" className="package-manager-tabs">
      {managers.map((item) => <button key={item} type="button" role="tab" id={`${id}-${item}`} aria-selected={manager === item} aria-controls={`${id}-command`} tabIndex={manager === item ? 0 : -1} onClick={() => setManager(item)} onKeyDown={moveTab}>{item}</button>)}
    </div>
    <div id={`${id}-command`} role="tabpanel" aria-labelledby={`${id}-${manager}`}>
      <pre className="package-command" data-language="shell"><code>{command}</code></pre>
    </div>
  </div>;
}
