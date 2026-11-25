'use client';

import { useEffect, useState } from 'react';
import { Github, Star } from 'lucide-react';

type Props = { className?: string; label?: string };

export default function GitHubLink({ className = '', label = 'GitHub' }: Props) {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/github-stars', { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error('GitHub star count unavailable'); return response.json(); })
      .then((value: { stars?: unknown }) => {
        if (typeof value.stars === 'number' && Number.isSafeInteger(value.stars) && value.stars >= 0) setStars(value.stars);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const accessibleName = stars === null ? 'Open FullAuth repository on GitHub' : `Open FullAuth repository on GitHub, ${stars} stars`;
  return <a className={`github-control ${className}`} href="https://github.com/A-AllaaEddine/fullauth" target="_blank" rel="noopener noreferrer" aria-label={accessibleName}>
    <Github aria-hidden="true" size={15}/><span className="github-label">{label}</span>
    {stars !== null && <span className="github-stars"><Star aria-hidden="true" size={12} fill="currentColor"/><span>{stars}</span></span>}
  </a>;
}
