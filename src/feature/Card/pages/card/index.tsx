import { useCallback, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { BackgroundImage, Container, Layout, SearchInput } from '../../../../components';
import { Pagination, usePagination } from '../../../../components/Pagination';
import { useAppContext, useDebounce } from '../../../../hooks';
import { ChangeInputEvent, PaginatedResult, paginationQuery } from '../../../../types';
import { buildContains, errorMessages } from '../../../../utils';
import { CardHeader } from '../../CardHeader';
import { CardList } from '../../CardList';
import { useCardApi, useCardContext } from '../../hooks';
import { CardActions } from '../../store';
import { CardModel } from '../../types';
import { SharedProps } from '../../types/shared-props.enum';

function Card() {
  const api = useCardApi();
  const { changeError } = useAppContext();
  const { currentPage, changePage, next, previous } = usePagination();

  const [searchText, setSearchText] = useState<string>('');

  const { dispatchCard, currentCardsPage, changeCurrentCardsPage } = useCardContext();
  const [totalCards, setTotalCards] = useState(0);

  const debouncedValue = useDebounce<string>(searchText, 500);

  const { data: getCardsData } = api.useOData<PaginatedResult<CardModel>>(
    debouncedValue
      ? {
          ...paginationQuery(currentCardsPage),
          $filter: buildContains(SharedProps.Name, debouncedValue),
        }
      : paginationQuery(currentCardsPage),
  );

  const filterCards = useCallback(() => {
    changeCurrentCardsPage(1);
  }, [changeCurrentCardsPage]);

  useEffect(() => {
    changeCurrentCardsPage(currentPage);
  }, [currentPage, changeCurrentCardsPage]);

  useEffect(() => {
    if (debouncedValue === undefined) return;

    filterCards();
  }, [debouncedValue]);

  useEffect(() => {
    if (getCardsData == null) return;

    const { items, total } = getCardsData;
    const fetchedCards = items;
    setTotalCards(total);

    if (fetchedCards == null) {
      changeError(errorMessages.cardsError);
      return;
    }

    dispatchCard({
      type: CardActions.SetCards,
      payload: fetchedCards,
    });
  }, [dispatchCard, changeError, getCardsData]);

  const handleFilter = (withDebouce = false, event?: ChangeInputEvent) => {
    if (event != null) setSearchText(event.target.value);
    if (withDebouce) return;
    filterCards();
  };

  return (
    <Layout>
      <BackgroundImage>
        <SearchInput
          id="searchCards"
          placeholder="Digite aqui sua busca..."
          onIconClick={handleFilter}
          onEnter={handleFilter}
          value={searchText}
          onChange={(e) => handleFilter(true, e)}
        />
      </BackgroundImage>
      <Container>
        <CardHeader />
        <CardList />
        <Pagination
          currentPage={currentPage}
          next={next}
          previous={previous}
          changePage={changePage}
          totalItems={totalCards ?? 0}
        />
      </Container>
      <Outlet />
    </Layout>
  );
}

export default Card;
