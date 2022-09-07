import { SharedProps } from './shared-props.enum';

export class PhotoModel {
  [SharedProps.Id]?: number;
  base64?: string;
}
