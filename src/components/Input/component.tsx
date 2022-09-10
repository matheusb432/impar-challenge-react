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
  onKeyDown?: ((e: React.KeyboardEvent<HTMLInputElement>) => void) | null;
}

export interface InputForwardRef {
  clickInput: () => void;
  getValue: () => string;
  setValue: (value?: string) => void;
}

const Input = forwardRef<InputForwardRef, InputProps>(
  (
    {
      children,
      type = 'text',
      className,
      placeholder,
      id,
      value,
      label,
      onChange,
      onBlur,
      onKeyDown,
      isInvalid = false,
    }: InputProps,
    ref
  ) => {
    const [touched, setTouched] = useState(false);
    const inputRef = useInputRef();

    const clickInput = () => {
      inputRef.current?.click();
      inputRef.current?.focus();
    };

    const getValue = () => inputRef.current!.value;

    const setValue = (value?: string) => {
      inputRef.current!.value = value ?? '';
    };

    const handleBlur = () => {
      setTouched(true);

      onBlur?.();
    };

    useImperativeHandle(ref, () => {
      return {
        clickInput: clickInput,
        setValue: setValue,
        getValue: getValue,
      };
    });

    return (
      <div
        className={`${styles.control} ${
          touched && isInvalid ? styles.invalid : ''
        } ${className ?? ''}`}
      >
        {!!label?.trim() && <label htmlFor={id}>{label}</label>}
        <input
          ref={inputRef}
          type={type}
          id={id}
          onBlur={handleBlur}
          onChange={onChange}
          value={value}
          placeholder={placeholder ?? ''}
          onKeyDown={(e) => onKeyDown?.(e)}
        ></input>
        {children}
      </div>
    );
  }
);

export default Input;
