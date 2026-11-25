import type { MetadataRoute } from 'next';
import { siteOrigin } from '@/lib/metadata';

const routes = [
  '/',
  '/introduction',
  '/installation',
  '/next/installation',
  '/next/usage',
  '/react-native/installation',
  '/react-native/usage',
  '/providers/credentials',
  '/providers/google',
  '/examples',
  '/typescript',
  '/changelog',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({ url: new URL(path, siteOrigin).toString() }));
}
