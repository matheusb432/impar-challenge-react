import { SearchIcon } from '../../assets/icons';
import { ChangeInputEvent } from '../../types';
import { IconButton } from '../IconButton';
import { Input } from '../Input';
import styles from './style.module.scss';

interface SearchInputProps {
  id: string;
  placeholder: string;
  value?: string;
  className?: string;
  onChange?: (event: ChangeInputEvent) => void;
  onBlur?: () => void;
  filter: () => void;
}

const SearchInput = ({
  id,
  placeholder,
  value,
  className,
  onChange,
  onBlur,
  filter,
}: SearchInputProps) => {
  return (
    <Input
      className={`${styles['search-input']} ${className ?? ''}`}
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    >
      <SearchIcon onClick={filter} className={`${styles['search-icon']}`} />
    </Input>
  );
};

export default SearchInput;
