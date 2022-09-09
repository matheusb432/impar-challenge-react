import { createContext, Dispatch, ReactNode, useReducer } from 'react';
import { Outlet } from 'react-router-dom';
import cardReducer, { initialCardState } from './reducer';
import { CardAction, CardState } from './types';

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
