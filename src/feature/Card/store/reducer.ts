import { CardModel } from './../types/card-model';
import { CardAction, CardActions, CardState } from './types';

const { AddCard, EditCard, RemoveCard, SetFormCard, SetCards } = CardActions;

const initialCardState = (): CardState => ({
  // TODO remove mock cards
  cards: [
    {
      id: 1,
      name: 'card 1',
      status: 'status 1',
    },
    {
      id: 2,
      name: 'card 2',
      status: 'status 2',
    },
    {
      id: 3,
      name: 'card 3',
      status: 'status 3',
    },
    {
      id: 4,
      name: 'card 4',
      status: 'status 4',
    },
    {
      id: 5,
      name: 'card 5',
      status: 'status 5',
    },
  ],
  formCard: CardModel.empty(),
});

const cardReducer = (state: CardState, action: CardAction): CardState => {
  const { type, payload } = action;
  const { cards } = state;

  switch (type) {
    case AddCard:
      return { ...state, cards: [...cards, payload as CardModel] };

    case EditCard:
      const editedCard = payload as CardModel;
      const newCards = [
        ...cards.filter((c) => c.id !== editedCard.id),
        editedCard,
      ];

      return { ...state, cards: newCards };

    case RemoveCard:
      return {
        ...state,
        cards: cards.filter((c) => c !== (payload as CardModel)),
      };

    case SetFormCard:
      return { ...state, formCard: payload as CardModel };

    case SetCards:
      return { ...state, cards: payload as CardModel[] };

    default:
      return { ...state };
  }
};

export default cardReducer;
export { initialCardState };
