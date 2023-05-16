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

  static fromApiUpdate(
    id: number,
    name: string,
    status: string,
    photoBase64: string,
    photoId: number,
  ): CardModel {
    const card = this.fromInputs(name, status, photoBase64);

    card.id = id;
    card.photoId = photoId;

    return card;
  }

  static fromInputs(name: string, status: string | undefined, photoBase64: string): CardModel {
    const card = new CardModel();

    card.name = name;
    card.status = status;
    card.photo = PhotoModel.fromInputs(photoBase64);

    return card;
  }

  static forPost(
    name: string | undefined,
    status: string | undefined,
    photoId: number | undefined,
  ): CardModel {
    const card = new CardModel();

    card.name = name;
    card.status = status;
    card.photoId = photoId;

    return card;
  }

  static forPut(
    id: number | undefined,
    name: string | undefined,
    status: string | undefined,
    photoId: number | undefined,
  ): CardModel {
    const card = new CardModel();

    card.id = id;
    card.name = name;
    card.status = status;
    card.photoId = photoId;

    return card;
  }
}
