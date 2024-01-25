import Link from 'next/link';
import { TbBrandNextjs, TbBrandReactNative } from 'react-icons/tb';

const Installation = () => {
  return (
    <div className="flex h-full flex-col items-start justify-start gap-6 px-16 py-6">
      <p className="w-full text-start font-bold text-4xl text-gray-300">
        Installation
      </p>
      <p className="w-2/3 text-start">
        Below, you'll find instructions on how to install FullAuth based on your
        development platform. Choose the platform that matches your project, and
        follow the provided steps to get started quickly.
      </p>
      <div className="w-full h-full flex flex-wrap justify-start items-center gap-5 mt-10">
        <Link
          href={'/next/installation'}
          className="w-40 h-40 rounded-xl border-[1px] border-gray-600 flex flex-col justify-center items-center gap-3 p-3
          hover:border-gray-300"
        >
          <TbBrandNextjs className="w-10 h-10 text-gray-300" />
          <p className=" text-center font-semibold text-gray-300">Next.js</p>
        </Link>
        <Link
          href={'/react-native/installation'}
          className="w-40 h-40 rounded-xl border-[1px] border-gray-600 flex flex-col justify-center items-center gap-3 p-3
          hover:border-gray-300"
        >
          <TbBrandReactNative className="w-10 h-10 text-gray-300" />
          <p className=" text-center font-semibold text-gray-300">
            React Native
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Installation;
