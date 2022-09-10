import { forwardRef, useImperativeHandle } from 'react';
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
  placeholder?: string;
  className?: string;
  onChange?: (event: ChangeInputEvent) => void;
  onBlur?: () => void;
}

export interface FileInputForwardRef {
  clickInput: () => void;
  getValue: () => string;
}

const FileInput = forwardRef<FileInputForwardRef, FileInputProps>(
  (
    {
      id,
      label,
      placeholder = 'Nenhum arquivo selecionado',
      className,
      onChange,
      onBlur,
    }: FileInputProps,
    ref
  ) => {
    const fileInputRef = useInputRef<InputForwardRef>();

    const selectFile = () => {
      fileInputRef.current?.clickInput();
    };

    useImperativeHandle(ref, () => ({
      clickInput: () => {
        fileInputRef.current?.clickInput();
      },
      getValue: () => {
        return fileInputRef.current?.getValue()!;
      },
    }));

    return (
      <Input
        type="file"
        className={`${styles['file-input']} ${className ?? ''}`}
        id={id}
        label={label}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        ref={fileInputRef}
      >
        <Button onClick={selectFile} outlineStyle={true}>
          Escolher arquivo
        </Button>
      </Input>
    );
  }
);

export default FileInput;
