import React from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';

export const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }: any) => {
  const pageNumbers: number[] = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = () => {
    const pageRangeDisplayed = 5;
    const currentPageIndex = currentPage - 1;

    if (pageNumbers.length <= pageRangeDisplayed) {
      return pageNumbers.map(number => (
        <ul
          key={number}
          className={`${
            currentPage === number
              ? 'p-2 w-[30px] flex justify-center items-center h-[30px] bg-sky-800 text-white rounded-full transition-all duration-300'
              : 'p-2 w-[30px] flex justify-center items-center h-[30px] rounded-full transition-all duration-300 hover:bg-gray-300'
          }`}
        >
          <li key={number}>
            <a onClick={() => paginate(number)}>{number}</a>
          </li>
        </ul>
      ));
    }

    let startPage = 0;
    let endPage = 0;
    if (currentPageIndex <= Math.floor(pageRangeDisplayed / 2)) {
      startPage = 0;
      endPage = pageRangeDisplayed - 1;
    } else if (currentPageIndex >= pageNumbers.length - Math.ceil(pageRangeDisplayed / 2)) {
      startPage = pageNumbers.length - pageRangeDisplayed;
      endPage = pageNumbers.length - 1;
    } else {
      startPage = currentPageIndex - Math.floor(pageRangeDisplayed / 2);
      endPage = currentPageIndex + Math.floor(pageRangeDisplayed / 2);
    }

    const pages = pageNumbers.slice(startPage, endPage + 1);

    return (
      <>
        {startPage !== 0 && <span>...</span>}
        {pages.map(number => (
          <ul
            key={number}
            className={`${
              currentPage === number
                ? 'p-2 w-[30px] flex justify-center items-center h-[30px] bg-sky-800 text-white rounded-full transition-all duration-300'
                : 'p-2 w-[30px] flex justify-center items-center h-[30px] rounded-full transition-all duration-300 hover:bg-gray-300'
            }`}
          >
            <li key={number}>
              <a onClick={() => paginate(number)}>{number}</a>
            </li>
          </ul>
        ))}
        {endPage !== pageNumbers.length - 1 && <span>...</span>}
        {/* <ul
          key={pageNumbers.length}
          className={`${
            currentPage === pageNumbers.length
              ? "p-2 w-[30px] flex justify-center items-center h-[30px] bg-sky-800 text-white rounded-full transition-all duration-300"
              : "p-2 w-[30px] flex justify-center items-center h-[30px] rounded-full transition-all duration-300 hover:bg-gray-300"
          }`}
        >
          <li key={pageNumbers.length}>
            <a onClick={() => paginate(pageNumbers.length)}>
              {pageNumbers.length}
            </a>
          </li>
        </ul> */}
      </>
    );
  };

  return (
    <div className="flex gap-2 justify-center items-center w-60">
      <FaAngleLeft
        onClick={() => paginate(currentPage - 1)}
        className={`cursor-pointer ${currentPage === 1 ? 'pointer-events-none text-gray-300' : ''}`}
      />
      {renderPageNumbers()}
      <FaAngleRight
        onClick={() => paginate(currentPage + 1)}
        className={`cursor-pointer ${
          currentPage >= Math.ceil(totalItems / itemsPerPage)
            ? 'pointer-events-none text-gray-300'
            : ''
        }`}
      />
    </div>
  );
};
