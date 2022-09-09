import { createContext, Dispatch, ReactNode, useReducer } from 'react';
import cardReducer, { initialCardState } from './reducer';
import { CardAction, CardState } from './types';

// extends CardState
interface CardContextProps {
  // cards: CardModel[];
  // formCard: CardModel;
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
  // const cards;
  // const formCard;
  const [cardState, dispatchCard] = useReducer(cardReducer, initialCardState());

  return (
    <CardContext.Provider value={{ cardState, dispatchCard }}>
      {children}
    </CardContext.Provider>
  );
};

export default CardContext;
export { CardContextProvider };
