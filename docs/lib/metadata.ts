import type { Metadata } from 'next';

export const siteOrigin = 'https://full-auth.vercel.app';

type PageMetadataInput = {
  path: string;
  title: string;
  description: string;
};

export function pageMetadata({ path, title, description }: PageMetadataInput): Metadata {
  const canonicalPath = path.startsWith('/') ? path : `/${path}`;
  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: `${title} | FullAuth`,
      description,
      url: canonicalPath,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | FullAuth`,
      description,
    },
  };
}
