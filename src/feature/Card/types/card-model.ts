import { PhotoModel } from './photo-model';
import { SharedProps } from './shared-props.enum';

export class CardModel {
  [SharedProps.Id]?: number;
  [SharedProps.PhotoId]?: number;
  [SharedProps.Name]?: string;
  [SharedProps.Status]?: string;
  [SharedProps.Photo]?: PhotoModel;

  static empty() {
    const card = new CardModel();

    card.name = '';
    card.status = '';

    return card;
  }
}
