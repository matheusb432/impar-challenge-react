import { forwardRef, useImperativeHandle } from 'react';
import { useInputRef } from '../../hooks';
import { ChangeInputEvent } from '../../types';
import { Button } from '../Button';
import { Input, InputForwardRef } from '../Input';
import styles from './style.module.scss';

interface FileInputProps {
  id: string;
  label: string;
  accept: string;
  isInvalid?: boolean;
  required?: boolean;
  helperText?: string;
  placeholder?: string;
  className?: string;
  blurOnChange?: boolean;
  onChange?: (event: ChangeInputEvent) => void;
  onBlur?: () => void;
}

export interface FileInputForwardRef {
  clickInput: () => void;
  getValue: () => string;
}

const FileInput = forwardRef<FileInputForwardRef, FileInputProps>(
  (props: FileInputProps, ref) => {
    const {
      id,
      label,
      accept,
      helperText,
      blurOnChange = false,
      isInvalid = false,
      required = true,
      placeholder = 'Nenhum arquivo selecionado',
      className,
      onChange,
      onBlur,
    } = props;
    const sharedProps = {
      id,
      label,
      isInvalid,
      required,
      blurOnChange,
      accept,
      helperText,
      placeholder,
      onChange,
      onBlur,
    };

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
        {...sharedProps}
        type="file"
        className={`${styles['file-input']} ${className ?? ''}`}
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
