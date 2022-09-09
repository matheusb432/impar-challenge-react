import { PhotoModel } from './photo-model';
import { SharedProps } from './shared-props.enum';

export class CardModel {
  [SharedProps.Id]?: number;
  [SharedProps.PhotoId]?: number;
  [SharedProps.Name]?: string;
  [SharedProps.Status]?: string;
  [SharedProps.Photo]?: PhotoModel;

  static empty(): CardModel {
    const card = new CardModel();

    card.name = '';
    card.status = '';

    return card;
  }

  static fromEdit(
    id: number,
    name: string,
    status: string,
    photoBase64: string
  ): CardModel {
    const card = this.fromInputs(name, status, photoBase64);

    card.id = id;

    return card;
  }

  static fromInputs(
    name: string,
    status: string,
    photoBase64: string
  ): CardModel {
    const card = new CardModel();

    card.name = name;
    card.status = status;
    card.photo = PhotoModel.fromInputs(photoBase64);

    return card;
  }
}
