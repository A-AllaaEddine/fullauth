import Link from 'next/link';

const Examples = () => {
  return (
    <div className="flex h-full flex-col items-start justify-start gap-6 px-16 py-6">
      <p className="w-full text-start font-bold text-4xl text-gray-300">
        Examples
      </p>
      <p className="w-full text-start">
        Explore our{' '}
        <Link
          href={'https://github.com/A-AllaaEddine/fullauth/tree/main/examples'}
          target="_blank"
          className="text-blue-500"
        >
          Examples
        </Link>{' '}
        section for detailed examples showcasing FullAuth integration into
        different types of applications:
      </p>
      <div className="w-1/3 h-auto flex flex-col justify-start items-start gap-5 rounded-xl bg-[#1d1d1d] p-5">
        <Link
          href={
            'https://github.com/A-AllaaEddine/fullauth/tree/main/examples/nextjs'
          }
          className="text-blue-500"
        >
          - Next.js Authentication Example.
        </Link>
        <Link
          href={
            'https://github.com/A-AllaaEddine/fullauth/tree/main/examples/nextjs'
          }
          className="text-blue-500"
        >
          - React Native Authentication Example.
        </Link>
      </div>
    </div>
  );
};

export default Examples;
