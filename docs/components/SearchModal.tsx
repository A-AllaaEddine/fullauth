'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Search from '@/lib/search.json';
import { FaSearch } from 'react-icons/fa';
import Link from 'next/link';

const SearchModal = () => {
  const [resutls, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setResults([]);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(!isOpen)} asChild>
        <div
          className="w-32 h-6 flex justify-center items-center gap-2 bg-gray-400 
          rounded-lg px-2 hover:cursor-pointer"
        >
          <p className="w-full text-black text-sm">Search</p>
          <FaSearch className="text-black font-bold w-5 h-5" color="black" />
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-[500px]  bg-[#0f0f0f] border-none text-gray-600 pt-14 ">
        <div
          className="w-full h-14 bg-gray-400  px-2 rounded-md
                flex justify-start items-center border-2 border-white"
        >
          <FaSearch className="text-black font-bold w-5 h-5" color="black" />
          <input
            title="search"
            name="search"
            onChange={(e) => {
              const temp: any[] = [];
              Search.map((obj) => {
                if (
                  e.target.value.length > 0 &&
                  obj.name.includes(e.target.value.toLowerCase())
                ) {
                  temp.push(obj);
                }
              });
              setResults(temp);
            }}
            className="w-full h-full bg-transparent border-none outline-none
                 px-2 rounded-md text-black placeholder:text-black
                 focus-within:border-none focus-within:outline-none"
            placeholder="Search"
          />
        </div>
        <div className="w-full max-h-[300px] bg-[#0f0f0f] px-2 overflow-y-auto rounded-md flex flex-col justify-start items-center gap-2">
          {resutls?.map((obj) => {
            return (
              <Link
                href={obj?.redirect}
                className="w-full h-12 rounded-md hover:bg-[#383838] hover:text-gray-300
                hover:border-gray-300
                text-gray-400 border-[1px] border-gray-400
                    flex justify-start items-center p-2"
                onClick={() => {
                  setIsOpen(!isOpen);
                  setResults([]);
                }}
              >
                <p>{obj?.name}</p>
              </Link>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
