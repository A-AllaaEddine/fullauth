import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  path: '/changelog',
  title: 'Changelog',
  description: 'Tag-backed FullAuth package changes and clearly separated unreleased website and documentation updates.',
});

const releases = [
  ['v2.2.1', 'Fixed a getServerSession issue.'],
  ['v2.2.0', 'Fixed Next.js 15 route-handler issues.'],
  ['v2.1.1', 'Fixed Next.js 16 support.'],
  ['v2.1.0', 'Added Next.js 16 support work.'],
  ['v2.0.0', 'Added Next.js 15 support.'],
  ['v1.2.1', 'Fixed package exports and set cookie SameSite to lax.'],
  ['v1.2.0', 'Replaced jsonwebtoken with jose for Vercel Edge compatibility.'],
  ['v1.1.2', 'Type fixes.'],
  ['v1.1.1', 'Fixed types.'],
  ['v1.1.0', 'Made baseUrl required in relevant React Native integration APIs.'],
  ['v1.0.2', 'Fixed token-callback platform types and made React Native SessionProvider baseUrl optional.'],
  ['v1.0.1', 'Added the platform property to the token callback.'],
  ['v1.0.0', 'Reworked internal functions, added the Google provider, fixed web session refresh, and added post-sign-in redirection.'],
] as const;

export default function ChangelogPage() {
  return <><p className="docs-breadcrumb">FULLAUTH / PROJECT</p><h1>Changelog</h1>
    <section><h2>Unreleased · website and documentation</h2><ul><li>Refined syntax highlighting and corrected examples and capability descriptions.</li><li>Added page metadata, canonical URLs, social metadata, sitemap, robots configuration, and an Open Graph image.</li></ul><p>These site changes are not authentication-package releases.</p></section>
    {releases.map(([version, summary]) => <section key={version}><h2>{version}</h2><p>{summary}</p></section>)}
    <p>Package publication differs by package and is not implied by a repository tag. See the <a href="https://www.npmjs.com/org/fullauth">FullAuth npm packages</a> for current package releases.</p>
  </>;
}
