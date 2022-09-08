import {
  ChangeEvent,
  forwardRef,
  HTMLInputTypeAttribute,
  ReactNode,
  useImperativeHandle,
  useState,
} from 'react';
import { useInputRef } from '../../hooks';

import styles from './style.module.scss';

interface InputProps {
  children?: ReactNode;
  id: string;
  label?: string;
  placeholder?: string;
  className?: string;
  type?: HTMLInputTypeAttribute;
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
    {
      children,
      type = 'text',
      className,
      placeholder,
      id,
      label,
      onChange,
      onBlur,
      isInvalid = false,
    }: InputProps,
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
        } ${!!className && className}`}
      >
        {!!label?.trim() && <label htmlFor={id}>{label}</label>}
        <input
          ref={inputRef}
          type={type}
          id={id}
          onBlur={handleBlur}
          onChange={onChange}
          placeholder={placeholder ?? ''}
        ></input>
        {children}
      </div>
    );
  }
);

export default Input;
