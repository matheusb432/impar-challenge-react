import { Mapper } from 'mapper-ts/lib-esm';
import {
  createContext,
  Dispatch,
  ReactNode,
  useEffect,
  useReducer,
} from 'react';
import { Outlet } from 'react-router-dom';
import { useAxios } from '../../../hooks';
import { PaginatedResult, paginationQuery } from '../../../types';
import { useCardApi } from '../hooks/use-card-api';
import { CardModel } from '../types';
import cardReducer, { initialCardState } from './reducer';
import { CardAction, CardActions, CardState } from './types';

interface CardContextProps {
  cardState: CardState;
  dispatchCard: Dispatch<CardAction>;
}

interface CardContextProviderProps {
  children: ReactNode;
}

const CardContext = createContext<CardContextProps>({
  cardState: {} as CardState,
  dispatchCard: () => {},
});

const CardContextProvider = ({ children }: CardContextProviderProps) => {
  const [cardState, dispatchCard] = useReducer(cardReducer, initialCardState());

  const res = useCardApi().useOData<PaginatedResult<CardModel>>(
    paginationQuery()
  );
  const result = res.data?.data;

  useEffect(() => {
    if (result == null) return;

    dispatchCard({
      type: CardActions.SetCards,
      payload: new Mapper(CardModel).map(result.items),
    });
  }, [result]);

  return (
    <CardContext.Provider value={{ cardState, dispatchCard }}>
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
