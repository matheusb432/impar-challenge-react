import { useCallback, useEffect, useState } from 'react';
import { defaultItemsPerPage, DynamicJsx } from '../../types';
import { arrayFrom } from '../../utils';
import { Button } from '../Button';
import styles from './style.module.scss';

interface PaginationProps {
  currentPage: number;
  changePage: (page: number) => void;
  next: () => void;
  previous: () => void;
  totalItems?: number;
}

export interface PaginationForwardRef {
  currentPage: number;
  itemsPerPage: number;
}

function Pagination({
  currentPage,
  changePage,
  next,
  previous,
  totalItems = 1,
}: PaginationProps) {
  const [renderedPageItems, setRenderedPageItems] = useState<DynamicJsx>();
  const [maxPages, setMaxPages] = useState<number>(1);
  const itemsPerPage = defaultItemsPerPage;

  const renderPageItems = useCallback(() => arrayFrom(maxPages, 1).map((page: number) => (
    <button
      key={page}
      className={`${styles['page-item']} ${
        page === currentPage ? styles.active : ''
      }`}
      onClick={() => changePage(page)}
    >
      {page}
    </button>
  )), [changePage, currentPage, maxPages]);

  useEffect(() => {
    setMaxPages(
      Math.min(Math.max(Math.ceil(totalItems / itemsPerPage), 1), 10),
    );
  }, [itemsPerPage, totalItems]);

  useEffect(() => {
    setRenderedPageItems(renderPageItems());
  }, [maxPages, renderPageItems]);

  return (
    <section className={styles.pagination}>
      <Button
        onClick={previous}
        outlineStyle
        disabled={currentPage === 1}
      >
        Anterior
      </Button>

      <ul className={styles['pagination-list']}>{renderedPageItems}</ul>
      <div className={styles.next}>
        <Button
          onClick={next}
          outlineStyle
          disabled={currentPage === maxPages}
        >
          Próximo
        </Button>
        <p>
          Página
          {' '}
          {currentPage}
          {' '}
          de
          {' '}
          {maxPages}
        </p>
      </div>
    </section>
  );
}

export default Pagination;
