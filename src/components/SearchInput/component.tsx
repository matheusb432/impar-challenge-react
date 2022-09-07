import { ChangeInputEvent } from '../../types';
import { Input } from '../Input';
import styles from './style.module.scss';

interface SearchInputProps {
  id: string;
  placeholder: string;
  value?: string;
  onChange?: (event: ChangeInputEvent) => void;
  onBlur?: () => void;
}

const SearchInput = (props: SearchInputProps) => {
  return <Input className={styles['.search-input']} {...props}></Input>;
};

export default SearchInput;
