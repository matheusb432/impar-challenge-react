import { IgnoreMap } from 'mapper-ts/lib-esm';
import { SharedProps } from './shared-props.enum';

@IgnoreMap(SharedProps.Photo)
export class CardPutDto {
  [SharedProps.Id]?: number;
  [SharedProps.PhotoId]?: number;
  [SharedProps.Name]?: string;
  [SharedProps.Status]?: string;
}
