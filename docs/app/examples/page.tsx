import Link from 'next/link';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  path: '/examples',
  title: 'Examples',
  description: 'Reference projects for FullAuth Next.js and React Native integrations, with source and dependency limitations noted.',
});

export default function ExamplesPage() {
  return <><p className="docs-breadcrumb">FULLAUTH / LEARN</p><h1>Examples</h1>
    <p>These repository examples are reference projects and may use older package versions. Check each project manifest and README against the current package APIs before integrating.</p>
    <ul><li><Link href="https://github.com/A-AllaaEddine/fullauth/tree/main/examples/nextjs">Next.js example source</Link></li><li><Link href="https://github.com/A-AllaaEddine/fullauth/tree/main/examples/react-native-example">React Native example source</Link></li></ul>
    <p>The examples have not been validated end-to-end as part of this documentation audit.</p>
  </>;
}
