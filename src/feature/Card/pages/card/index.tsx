import { Mapper } from 'mapper-ts/lib-esm';
import { useCallback, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  BackgroundImage,
  Button,
  Container,
  Layout,
  SearchInput,
} from '../../../../components';
import { Pagination, usePagination } from '../../../../components/Pagination';
import { ToastData } from '../../../../components/Toast/toast-data';
import { useAppContext, useDebounce } from '../../../../hooks';
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
  const { changeError, showToast } = useAppContext();
  const paginationProps = usePagination();

  const [searchText, setSearchText] = useState<string>('');

  const [toggleSearch, setToggleSearch] = useState<boolean | undefined>(
    undefined
  );

  const { dispatchCard, currentCardsPage, changeCurrentCardsPage } =
    useCardContext();
  const [totalCards, setTotalCards] = useState(0);

  const { debounceFn, clearTimer } = useDebounce(() => filterCards(), 500);

  const {
    data: getCardsData,
    status: getCardsStatus,
    mutate: getCards,
  } = api.useODataMutation<PaginatedResult<CardModel>>({
    ...paginationQuery(currentCardsPage),
    $filter: buildContains(SharedProps.Name, searchText),
  });

  const filterCards = useCallback(() => {
    clearTimer();
    getCards();
    changeCurrentCardsPage(1);
  }, [clearTimer, getCards, changeCurrentCardsPage]);

  useEffect(() => {
    changeCurrentCardsPage(paginationProps?.currentPage);
  }, [paginationProps?.currentPage, changeCurrentCardsPage]);

  useEffect(() => {
    setToggleSearch((prevState) => !prevState);
  }, [currentCardsPage]);

  useEffect(() => {
    if (toggleSearch === undefined) return;

    getCards();
  }, [getCards, toggleSearch]);

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
        <Button onClick={() => showToast(ToastData.error('aa'))}>aa</Button>
        <Button onClick={() => showToast(ToastData.success('aa'))}>aa</Button>
        <Button onClick={() => showToast(ToastData.warning('aa'))}>aa</Button>
        <CardHeader />
        <CardList />
        <Pagination {...paginationProps} totalItems={totalCards ?? 0} />
      </Container>
      <Outlet />
    </Layout>
  );
};

export default Card;
