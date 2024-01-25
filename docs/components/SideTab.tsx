'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SideTab = () => {
  const path = usePathname();

  return (
    <div
      className="w-60 fixed left-0 top-14   h-screen border-r-[1px] border-gray-600 flex flex-col justify-start items-center gap-1 p-4 
  "
    >
      <Accordion
        className="w-full"
        defaultValue={
          path === '/introduction' || '/quickstart' || '/installation'
            ? 'item-1'
            : undefined
        }
        type="single"
        collapsible
      >
        <AccordionItem className="w-full " value="item-1">
          <AccordionTrigger className="w-full h-14 p-3 hover:bg-[#1d1d1d] hover:text-white  rounded-lg">
            Getting Started
          </AccordionTrigger>
          <AccordionContent
            className={`w-full h-14 flex justify-center items-center p-4 my-1 gap-2 hover:bg-[#1d1d1d] hover:text-white  rounded-lg  
            ${path === '/introduction' ? 'bg-[#1d1d1d] text-white' : ''} `}
          >
            <Link href={'/introduction'} className={`w-full h-full`}>
              Introduction
            </Link>
          </AccordionContent>
          <AccordionContent
            className={`w-full h-14 flex justify-center items-center my-1 p-4 hover:bg-[#1d1d1d] hover:text-white  rounded-lg  ${
              path === '/installation' ? 'bg-[#1d1d1d] text-white' : ''
            }`}
          >
            <Link href={'/installation'} className="w-full h-full">
              Installation
            </Link>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion
        className="w-full"
        defaultValue={path.includes('next') ? 'item-2' : undefined}
        type="single"
        collapsible
      >
        <AccordionItem className="w-full " value="item-2">
          <AccordionTrigger className="w-full h-14 p-3 hover:bg-[#1d1d1d] hover:text-white  rounded-lg">
            Next.js
          </AccordionTrigger>
          <AccordionContent
            className={`w-full h-14 flex justify-center items-center my-1 p-4 hover:bg-[#1d1d1d] hover:text-white  rounded-lg  ${
              path === '/next/installation' ? 'bg-[#1d1d1d] text-white' : ''
            }`}
          >
            <Link href={'/next/installation'} className="w-full h-full">
              Installation
            </Link>
          </AccordionContent>
          <AccordionContent
            className={`w-full h-14 flex justify-center items-center my-1 p-4 hover:bg-[#1d1d1d] hover:text-white  rounded-lg  ${
              path === '/next/usage' ? 'bg-[#1d1d1d] text-white' : ''
            }`}
          >
            <Link href={'/next/usage'} className="w-full h-full">
              Usage
            </Link>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion
        className="w-full"
        defaultValue={path.includes('/react-native') ? 'item-3' : undefined}
        type="single"
        collapsible
      >
        <AccordionItem className="w-full " value="item-3">
          <AccordionTrigger className="w-full h-14 p-3 hover:bg-[#1d1d1d] hover:text-white  rounded-lg">
            React Native
          </AccordionTrigger>
          <AccordionContent
            className={`w-full h-14 flex justify-center items-center my-1 p-4 hover:bg-[#1d1d1d] hover:text-white  rounded-lg  ${
              path === '/react-native/installation'
                ? 'bg-[#1d1d1d] text-white'
                : ''
            }`}
          >
            <Link href={'/react-native/installation'} className="w-full h-full">
              Installation
            </Link>
          </AccordionContent>
          <AccordionContent
            className={`w-full h-14 flex justify-center items-center my-1 p-4 hover:bg-[#1d1d1d] hover:text-white  rounded-lg  ${
              path === '/react-native/usage' ? 'bg-[#1d1d1d] text-white' : ''
            }`}
          >
            <Link href={'/react-native/usage'} className="w-full h-full">
              Usage
            </Link>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Link
        href={'/examples'}
        className={`w-full h-12 text-start font-semibold p-3 flex justify-start items-center hover:bg-[#1d1d1d] hover:text-white  rounded-lg 
          ${path === '/examples' ? 'bg-[#1d1d1d] text-white' : ''}
          `}
      >
        Examples
      </Link>
      <Link
        href={'/typescript'}
        className={`w-full h-12 text-start font-semibold p-3 flex justify-start items-center hover:bg-[#1d1d1d] hover:text-white  rounded-lg 
          ${path === '/typescript' ? 'bg-[#1d1d1d] text-white' : ''}
          `}
      >
        Typescript
      </Link>
    </div>
  );
};

export default SideTab;
