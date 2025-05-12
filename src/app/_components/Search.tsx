import React, { FC, useEffect, useState } from 'react';
import { BiSearch, BiSolidDownArrow, BiSolidUpArrow } from 'react-icons/bi';

type Props = {
  searchQuery: string;
  setSearchQuery: any;
  results: any;
  renderItem: (item: any) => JSX.Element;
  onChange: React.ChangeEventHandler;
};

const Search = ({ setSearchQuery, searchQuery, results, renderItem, onChange }: Props) => {
  const [showResults, setShowResults] = useState(false);
  const [searchIsActive, setSearchIsActive] = useState(false);

  useEffect(() => {
    if (results.length > 0 && !showResults) setShowResults(true);

    if (results.length <= 0) setShowResults(false);
  }, [results, showResults]);

  type changeHandler = React.ChangeEventHandler<HTMLInputElement>;
  const handleChange: changeHandler = e => {
    setSearchIsActive(true);
    setSearchQuery(e.target.value);
    onChange && onChange(e);
  };

  return (
    <div className="relative">
      <div className="flex bg-transparent bg-white rounded-md border-2 justify-center items-center hover:border-2 hover:border-[#292929]">
        <div className="flex items-center justify-center w-[40px] cursor-pointer h-[50px] rounded-r-[5px]">
          <BiSearch className="text-blue-500" size={20} />
        </div>
        <input
          type="search"
          placeholder="Search Training Name"
          value={searchQuery}
          onChange={handleChange}
          className="bg-transparent w-[90%] border-none left-[50px] rounded-[5px] h-full outline-none text-black text-[16px] font-[500] font-Josefin"
        />
        <div className="flex items-center justify-center w-[40px] cursor-pointer h-[50px] rounded-r-[5px]">
          <div className="hover:bg-gray-100 hover:rounded-full transition-all hover:p-2">
            {searchIsActive ? (
              <BiSolidUpArrow
                className="text-gray-500 z-10"
                size={10}
                onClick={() => setSearchIsActive(false)}
              />
            ) : (
              <BiSolidDownArrow
                className="text-gray-500 z-10"
                size={10}
                onClick={() => setSearchIsActive(true)}
              />
            )}
          </div>
        </div>
      </div>
      {searchIsActive && results && results.length > 0 && (
        <div className="absolute mt-1 w-full p-2 bg-white shadow-lg rounded-bl-md rounded-br-md max-h-52 overflow-y-auto">
          {results?.map((val: any, index: number) => {
            return (
              <div
                key={index}
                className="cursor-pointer hover:bg-black hover:bg-opacity-10 p-2"
                onClick={() => {
                  setSearchQuery(val.title);
                  setSearchIsActive(false);
                }}
              >
                {renderItem(val)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Search;
