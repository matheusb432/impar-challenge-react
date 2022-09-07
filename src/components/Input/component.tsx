import { ChangeEvent, forwardRef, useImperativeHandle, useState } from 'react';
import { useInputRef } from '../../hooks';

import styles from './style.module.scss';

interface InputProps {
  type: string;
  id: string;
  label: string;
  isInvalid?: boolean;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
}

export interface InputForwardRef {
  activate: () => void;
}

const Input = forwardRef<InputForwardRef, InputProps>(
  (
    { type, id, label, onChange, onBlur, isInvalid = false }: InputProps,
    ref
  ) => {
    const [touched, setTouched] = useState(false);
    const inputRef = useInputRef();

    const focusInput = () => {
      inputRef.current?.focus();
    };

    const handleBlur = () => {
      setTouched(true);

      onBlur?.();
    };

    useImperativeHandle(ref, () => {
      return {
        activate: focusInput,
      };
    });

    return (
      <div
        className={`${styles.control} ${
          touched && isInvalid ? styles.invalid : ''
        }`}>
        <label htmlFor={id}>{label}</label>
        <input
          ref={inputRef}
          type={type}
          id={id}
          onBlur={handleBlur}
          onChange={onChange}
        />
      </div>
    );
  }
);

export default Input;
