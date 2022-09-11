import { CardModel } from '../types';
import { PhotoUpload } from '../types/photo-upload';

/**
 * Todas as possíveis ações que podem ser enviadas para o dispatcher de Card.
 *
 * @member AddCard Adicionar um novo CardModel à cards.
 * @member EditCard Editar um CardModel em cards.
 * @member Remove Remover um CardModel em cards.
 * @member SetFormCard Redefinir os valores do formulário de criação ou edição de card.
 * @member SetCards Redefinir os cards da lista de cards.
 * @member SetPhotoUpload Redefinir o arquivo de foto do estado.
 */
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

/**
 * Objeto com ação e payload da atualização do estado.
 *
 * @member type O identificador de qual ação precisará ser realizada no reducer.
 * @member payload O valor que atualizará o estado.
 */
export interface CardAction {
  type: CardActions;
  payload: CardModel[] | CardModel | number | PhotoUpload;
}
