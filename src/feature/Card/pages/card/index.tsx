import { Mapper } from 'mapper-ts/lib-esm';
import { useCallback, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  BackgroundImage,
  Container,
  Layout,
  SearchInput,
} from '../../../../components';
import {
  Pagination,
  PaginationForwardRef,
  usePagination,
} from '../../../../components/Pagination';
import { useAppContext, useDebounce, useElementRef } from '../../../../hooks';
import {
  ChangeInputEvent,
  PaginatedResult,
  paginationQuery,
  QueryStatuses,
} from '../../../../types';
import { buildContains, errorMessages } from '../../../../utils';
import { CardHeader } from '../../CardHeader';
import { CardList } from '../../CardList';
import { useCardApi, useCardContext } from '../../hooks';
import { CardActions } from '../../store';
import { CardModel } from '../../types';
import { SharedProps } from '../../types/shared-props.enum';

const Card = () => {
  const api = useCardApi();
  const { changeError } = useAppContext();
  const paginationProps = usePagination();
  const [currentCardsPage, setCurrentCardsPage] = useState(1);

  const [searchText, setSearchText] = useState<string>('');

  const [toggleSearch, setToggleSearch] = useState(false);

  const { cardState, dispatchCard } = useCardContext();
  const { cards } = cardState;
  const [totalCards, setTotalCards] = useState(0);

  const { debounceFn, clearTimer } = useDebounce(() => filterCards(), 500);

  // const paginationRef = useElementRef<PaginationForwardRef>();

  const {
    data: getCardsData,
    status: getCardsStatus,
    mutate: getCards,
  } = api.useODataMutation<PaginatedResult<CardModel>>({
    ...paginationQuery(currentCardsPage, 2),
    $filter: buildContains(SharedProps.Name, searchText),
  });

  const filterCards = useCallback(() => {
    clearTimer();
    getCards();
    setCurrentCardsPage(1);
  }, [clearTimer, getCards]);

  useEffect(() => {
    setCurrentCardsPage(paginationProps?.currentPage);
    // getCards();
  }, [paginationProps?.currentPage, getCards]);

  useEffect(() => {
    setToggleSearch((prevState) => !prevState);
  }, [currentCardsPage]);

  useEffect(() => {
    getCards();
  }, [getCards, toggleSearch]);
  // }, [currentCardsPage, getCards]);

  useEffect(() => {
    if (getCardsStatus !== QueryStatuses.Success) return;

    const { items, total } = getCardsData?.data;
    const fetchedCards = items;
    setTotalCards(total);

    if (fetchedCards == null) return changeError(errorMessages.cardsError);

    dispatchCard({
      type: CardActions.SetCards,
      payload: new Mapper(CardModel).map(fetchedCards),
    });
  }, [getCardsStatus, dispatchCard, changeError, getCardsData?.data]);

  const handleFilter = (withDebouce = false, event?: ChangeInputEvent) => {
    if (event != null) setSearchText(event.target.value);

    withDebouce ? debounceFn()() : filterCards();
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
        <Pagination {...paginationProps} totalItems={totalCards ?? 0} />
      </Container>
      <Outlet />
    </Layout>
  );
};

export default Card;
