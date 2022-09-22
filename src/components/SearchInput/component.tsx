import { SearchIcon } from '../../assets/icons';
import { ChangeInputEvent } from '../../types';
import { onEnterPress } from '../../utils';
import { Input } from '../Input';
import styles from './style.module.scss';

interface SearchInputProps {
  id: string;
  placeholder: string;
  value?: string;
  className?: string;
  onChange?: (event: ChangeInputEvent) => void;
  onBlur?: () => void;
  onEnter?: () => void;
  onIconClick: () => void;
}

function SearchInput({
  id,
  placeholder,
  value,
  className,
  onChange,
  onBlur,
  onIconClick,
  onEnter,
}: SearchInputProps) {
  return (
    <Input
      className={`${styles['search-input']} ${className ?? ''}`}
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={(e) => onEnterPress<HTMLInputElement>(e, onEnter)}
    >
      <SearchIcon
        onClick={() => onIconClick()}
        className={`${styles['search-icon']}`}
      />
    </Input>
  );
}

export default SearchInput;
