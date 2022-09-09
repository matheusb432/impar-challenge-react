import { CardModel } from './../types/card-model';
import { CardAction, CardActions, CardState } from './types';

const { AddCard, EditCard, RemoveCard, SetFormCard, SetCards } = CardActions;

const initialCardState = (): CardState => ({
  cards: [],
  formCard: CardModel.empty(),
});

const cardReducer = (state: CardState, action: CardAction): CardState => {
  const { type, payload } = action;
  const { cards } = state;

  switch (type) {
    case AddCard:
      return { ...state, cards: [...cards, payload as CardModel] };

    case EditCard:
      const newCard = payload as CardModel;
      const newCards = cards.filter((c) => c.id !== newCard.id);

      return { ...state, ...newCards, formCard: newCard };

    case RemoveCard:
      return {
        ...state,
        cards: cards.filter((c) => c.id !== (payload as number)),
      };

    case SetFormCard:
      return { ...state, formCard: payload as CardModel };

    case SetCards:
      return { ...state, cards: payload as CardModel[] };

    default:
      return state;
  }
};

export default cardReducer;
export { initialCardState };
