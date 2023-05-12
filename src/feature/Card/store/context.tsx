import { Mapper } from 'mapper-ts/lib-esm';
import {
  createContext,
  Dispatch,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { Outlet } from 'react-router-dom';
import { PaginatedResult, paginationQuery } from '../../../types';
import { useCardApi } from '../hooks/use-card-api';
import { CardModel } from '../types';
import cardReducer, { initialCardState } from './reducer';
import { CardAction, CardActions, CardState } from './types';

interface CardContextProps {
  cardState: CardState;
  dispatchCard: Dispatch<CardAction>;
  currentCardsPage: number;
  changeCurrentCardsPage: (currentCardsPage: number) => void;
  resetCardsPage: () => void;
}

interface CardContextProviderProps {
  children: ReactNode;
}

/**
 * Contexto para gerenciar o estado do domínio de Cards.
 *
 * @param cardState O estado atual de valores relacionados a este domínio.
 * @param dispatchCard Função para ser chamada sempre que é preciso atualizar o estado.
 */
const CardContext = createContext<CardContextProps>({
  cardState: {} as CardState,
  dispatchCard: () => {},
  currentCardsPage: 1,
  changeCurrentCardsPage: () => {},
  resetCardsPage: () => {},
});

function CardContextProvider({ children }: CardContextProviderProps) {
  const [cardState, dispatchCard] = useReducer(cardReducer, initialCardState());
  const [currentCardsPage, setCurrentCardsPage] = useState(1);
  const api = useCardApi();

  const { data, status } = api.useOData<PaginatedResult<CardModel>>(
    paginationQuery(currentCardsPage),
  );

  useEffect(() => {
    if (data == null) return;

    dispatchCard({
      type: CardActions.SetCards,
      payload: new Mapper(CardModel).map(data.items) as CardModel[],
    });
  }, [status, data]);

  const changeCurrentCardsPage = (page: number) => {
    setCurrentCardsPage(page);
  };

  const resetCardsPage = useCallback((): void => {
    changeCurrentCardsPage(1);
  }, [currentCardsPage]);

  const cardValue = useMemo(
    () => ({
      cardState,
      dispatchCard,
      currentCardsPage,
      changeCurrentCardsPage,
      resetCardsPage,
    }),
    [cardState, dispatchCard, currentCardsPage, changeCurrentCardsPage, resetCardsPage],
  );

  return <CardContext.Provider value={cardValue}>{children}</CardContext.Provider>;
}

function CardContextLayout() {
  return (
    <CardContextProvider>
      <Outlet />
    </CardContextProvider>
  );
}

export default CardContext;
export { CardContextProvider, CardContextLayout };
