'use client';

import { useEffect, useRef } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'fullauth-theme';

export default function ThemeControl() {
  const select = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if ((saved === 'light' || saved === 'dark' || saved === 'system') && select.current) select.current.value = saved;
  }, []);

  function changeTheme(next: ThemeMode) {
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <label className="theme-control">
      <span>Theme</span>
      <select ref={select} aria-label="Color theme" defaultValue="system" onChange={(event) => changeTheme(event.target.value as ThemeMode)}>
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  );
}
