import { SearchIcon } from '../../assets/icons';
import { useInputRef } from '../../hooks';
import { ChangeInputEvent } from '../../types';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { Input, InputForwardRef } from '../Input';
import styles from './style.module.scss';

interface FileInputProps {
  id: string;
  label: string;
  placeholder: string;
  value?: string;
  className?: string;
  onChange?: (event: ChangeInputEvent) => void;
  onBlur?: () => void;
}

const FileInput = ({
  id,
  label,
  placeholder,
  value,
  className,
  onChange,
  onBlur,
}: FileInputProps) => {
  const ref = useInputRef<InputForwardRef>();

  // TODO implement
  const selectFile = () => {
    ref.current?.clickInput();

    console.log(value);
  };

  return (
    <Input
      type="file"
      className={`${styles['file-input']} ${className ?? ''}`}
      id={id}
      ref={ref}
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    >
      <Button onClick={selectFile} outlineStyle={true}>
        Escolher arquivo
      </Button>
    </Input>
  );
};

export default FileInput;
