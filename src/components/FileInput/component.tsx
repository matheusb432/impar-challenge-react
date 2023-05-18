import { forwardRef, useImperativeHandle } from 'react';
import { useElementRef } from '../../hooks';
import { ChangeInputEvent } from '../../types';
import { Button } from '../Button';
import { Input, InputForwardRef } from '../Input';
import styles from './style.module.scss';

interface FileInputProps {
  id: string;
  label: string;
  accept: string;
  required?: boolean;
  helperText?: string;
  placeholder?: string;
  className?: string;
  hasError?: boolean;
  fileName?: string;
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
      accept,
      helperText,
      required,
      hasError,
      placeholder,
      className,
      onChange,
      onBlur,
      fileName,
    }: FileInputProps,
    ref,
  ) => {
    const fileInputRef = useElementRef<InputForwardRef>();

    const selectFile = () => {
      fileInputRef.current?.clickInput();
    };

    useImperativeHandle(ref, () => ({
      clickInput: () => {
        fileInputRef.current?.clickInput();
      },
      getValue: () => fileInputRef.current?.getValue()!,
    }));

    return (
      <Input
        id={id}
        label={label}
        required={required}
        accept={accept}
        helperText={helperText}
        placeholder={placeholder}
        hasError={hasError}
        onChange={onChange}
        onBlur={onBlur}
        type="file"
        className={`${styles['file-input']} ${className ?? ''}`}
        ref={fileInputRef}
      >
        <Button name={`${id}-button`} onClick={selectFile} outlineStyle style={{ width: '100%' }}>
          {fileName || 'Escolher arquivo'}
        </Button>
      </Input>
    );
  },
);

FileInput.defaultProps = {
  className: '',
  helperText: '',
  placeholder: 'Nenhum arquivo selecionado',
  required: true,
  hasError: false,
  onChange: () => {},
  onBlur: () => {},
  fileName: undefined,
};

export default FileInput;
