import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineCaretUp, AiOutlineCaretDown } from 'react-icons/ai';
import { list } from '../../utils/list';

type Props = {
  selectedFilter: string;
  setSelectedFilter: any;
};

export default function Dropdown({ selectedFilter, setSelectedFilter }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center w-[175px]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="bg-white w-full p-1 flex items-center justify-between rounded-lg tracking-wider border-2 border-[#aca6a6] 
        hover:border-sky-700 border-1 active:border-sky-700 "
      >
        <p className="text-[15px] font-[500]">{selectedFilter || 'Name'}</p>
        {!isOpen ? (
          <AiOutlineCaretDown className="h-8 text-[#696969]" />
        ) : (
          <AiOutlineCaretUp className="h-8 text-[#696969]" />
        )}
      </button>
      {isOpen && (
        <div className="bg-white shadow-2xl absolute top-14 flex flex-col items-start rounded-lg p-2 w-full">
          {list.map((item, index) => {
            return (
              <button
                key={item.id}
                className={`flex w-full justify-between p-2 hover:bg-gray-200 cursor-pointer rounded-r-lg border-l-transparent hover:border-l-black border-l-4 ${
                  selectedFilter === item.name ? 'bg-gray-200 border-l-black' : ''
                }`}
                onClick={() => {
                  setSelectedFilter(item.name);
                  setIsOpen(false);
                }}
              >
                <h3 className="font-[600]">{item.name}</h3>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
