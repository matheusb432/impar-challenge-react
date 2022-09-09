import { IconProps } from '../../assets/icons';

export interface ModalData {
  title: string;
  iconFn: (props: IconProps) => JSX.Element;
  iconProps: IconProps;
  confirmText: string;
  colorTheme?: string;
}
