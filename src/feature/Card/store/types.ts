import { CardModel } from '../types';

export enum CardActions {
  AddCard = 'ADD_CARD',
  EditCard = 'EDIT_CARD',
  RemoveCard = 'REMOVE_CARD',
  SetFormCard = 'SET_FORM_CARD',
  SetCards = 'SET_CARDS',
}

export interface CardState {
  cards: CardModel[];
  formCard: CardModel;
}

export interface CardAction {
  type: CardActions;
  payload: CardModel[] | CardModel | number;
}
