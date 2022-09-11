import { useState } from 'react';

const usePagination = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  const next = () => {
    setCurrentPage((prevState) => prevState + 1);
    console.log(currentPage);
  };

  const previous = () => {
    setCurrentPage((prevState) => prevState - 1);
    console.log(currentPage);
  };

  return { currentPage, changePage, next, previous };
};

export default usePagination;
