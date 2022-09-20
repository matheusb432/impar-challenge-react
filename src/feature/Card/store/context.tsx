import { Mapper } from 'mapper-ts/lib-esm';
import {
  createContext,
  Dispatch,
  ReactNode,
  useCallback,
  useEffect,
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

const CardContextProvider = ({ children }: CardContextProviderProps) => {
  const [cardState, dispatchCard] = useReducer(cardReducer, initialCardState());
  const [currentCardsPage, setCurrentCardsPage] = useState(1);

  const {
    data,
    status,
    mutate: mutateCards,
  } = useCardApi().useODataMutation<PaginatedResult<CardModel>>(
    paginationQuery(currentCardsPage)
  );

  useEffect(() => {
    mutateCards();
  }, [mutateCards]);

  const result = data?.data;

  useEffect(() => {
    if (result == null) return;

    dispatchCard({
      type: CardActions.SetCards,
      payload: new Mapper(CardModel).map(result.items) as CardModel[],
    });
  }, [status, result]);

  const changeCurrentCardsPage = (page: number) => {
    setCurrentCardsPage(page);
  };

  // const resetCardsPage = () => {
  //   if (currentCardsPage === 1) return mutateCards();

  //   changeCurrentCardsPage(1);
  // };
  const resetCardsPage = useCallback(() => {
    if (currentCardsPage === 1) return mutateCards();

    changeCurrentCardsPage(1);
  }, [currentCardsPage, mutateCards]);

  return (
    <CardContext.Provider
      value={{
        cardState,
        dispatchCard,
        currentCardsPage,
        changeCurrentCardsPage,
        resetCardsPage,
      }}
    >
      {children}
    </CardContext.Provider>
  );
};

const CardContextLayout = () => (
  <CardContextProvider>
    <Outlet />
  </CardContextProvider>
);

export default CardContext;
export { CardContextProvider, CardContextLayout };
