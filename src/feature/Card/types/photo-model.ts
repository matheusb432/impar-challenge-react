import { SharedProps } from './shared-props.enum';

export class PhotoModel {
  [SharedProps.Id]?: number;
  base64?: string;

  static fromInputs(base64: string): PhotoModel {
    const photo = new PhotoModel();

    photo.base64 = base64;

    return photo;
  }
}
