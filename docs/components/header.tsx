import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';

import SearchModal from './SearchModal';

const Header = () => {
  return (
    <div className="w-full fixed bg-[#0f0f0f] z-20 h-14 flex justify-center items-center px-10 border-b-[1px] border-gray-600">
      <div className="w-auto h-full flex justify-center items-center">
        FullAuth
      </div>
      <div className="w-full h-full flex justify-center items-center gap-3">
        {/* <p>Docs</p>
        <p>Quickstart</p> */}
      </div>
      <div
        className="w-auto h-full flex justify-center items-center gap-3"
        // onClick={() => setSearchModalOpen(true)}
      >
        <SearchModal />

        <Link
          href={'https://github.com/A-AllaaEddine/fullauth'}
          className="hover:text-gray-300 text-gray-400"
          target="_blank"
        >
          <FaGithub className="w-6 h-6 " />
        </Link>
        {/* <p className="w-auto whitespace-nowrap p-2">Dark mode</p> */}
      </div>
    </div>
  );
};

export default Header;
