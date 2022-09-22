import { PhotoUpload } from '../types/photo-upload';
import { CardModel } from '../types/card-model';
import { CardAction, CardActions, CardState } from './types';

const { AddCard, EditCard, RemoveCard, SetFormCard, SetCards, SetPhotoUpload } = CardActions;

const initialCardState = (): CardState => ({
  cards: [],
  formCard: CardModel.empty(),
  photoUpload: PhotoUpload.empty(),
});

/**
 * Reducer para manipular o estado do domínio de Cards.
 *
 * @param state O estado atual de valores relacionados a este domínio, implícito
 * na chamada de useReducer
 * @param action Objeto com ação e payload da atualização do estado.
 * @returns Novo estado atualizado.
 */
const cardReducer = (state: CardState, action: CardAction): CardState => {
  const { type, payload } = action;
  const { cards } = state;

  switch (type) {
    case AddCard:
      return { ...state, cards: [...cards, payload as CardModel] };

    case EditCard: {
      const editedCard = payload as CardModel;
      const newCards = [...cards.filter((c) => c.id !== editedCard.id), editedCard];

      return { ...state, cards: newCards };
    }

    case RemoveCard:
      return {
        ...state,
        cards: cards.filter((c) => c !== (payload as CardModel)),
      };

    case SetFormCard:
      return { ...state, formCard: payload as CardModel };

    case SetCards:
      return { ...state, cards: payload as CardModel[] };

    case SetPhotoUpload:
      return { ...state, photoUpload: payload as PhotoUpload };

    default:
      return { ...state };
  }
};

export default cardReducer;
export { initialCardState };
