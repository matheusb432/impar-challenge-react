import { CardModel } from '../types';
import { PhotoUpload } from '../types/photo-upload';

export enum CardActions {
  AddCard = 'ADD_CARD',
  EditCard = 'EDIT_CARD',
  RemoveCard = 'REMOVE_CARD',
  SetFormCard = 'SET_FORM_CARD',
  SetCards = 'SET_CARDS',
  SetPhotoUpload = 'SET_PHOTO_UPLOAD',
}

export interface CardState {
  cards: CardModel[];
  formCard: CardModel;
  photoUpload: PhotoUpload;
}

export interface CardAction {
  type: CardActions;
  payload: CardModel[] | CardModel | number | PhotoUpload;
}
