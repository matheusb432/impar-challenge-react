import { IgnoreMap } from 'mapper-ts/lib-esm';
import { SharedProps } from './shared-props.enum';

@IgnoreMap(SharedProps.Photo)
export class CardPostDto {
  [SharedProps.PhotoId]?: number;
  [SharedProps.Name]?: string;
  [SharedProps.Status]?: string;
}
