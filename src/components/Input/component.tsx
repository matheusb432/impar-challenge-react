import {
  ChangeEvent,
  forwardRef,
  HTMLInputTypeAttribute,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useInputRef } from '../../hooks';
import { ChangeInputEvent, DynamicJsx } from '../../types';
import { validateText } from '../../utils';

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
  helperText?: string;
  accept?: string;
  required?: boolean;
  showHelperIfValid?: boolean;
  blurOnChange?: boolean;
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
      accept,
      label,
      onChange,
      onBlur,
      onKeyDown,
      blurOnChange = false,
      helperText,
      showHelperIfValid = false,
      required = true,
      isInvalid = false,
    }: InputProps,
    ref
  ) => {
    const [touched, setTouched] = useState(false);
    const [renderedHelper, setRenderedHelper] = useState<DynamicJsx>();
    const [renderedLabel, setRenderedLabel] = useState<DynamicJsx>();
    const inputRef = useInputRef();

    const renderHelper = useCallback(() => {
      return (
        touched &&
        validateText(helperText) &&
        (showHelperIfValid || isInvalid) && (
          <span className={styles.helper}>{helperText}</span>
        )
      );
    }, [touched, showHelperIfValid, isInvalid, helperText]);

    const renderLabel = useCallback(() => {
      return (
        !!label?.trim() && (
          <label htmlFor={id}>
            <span className={styles.label}>{label}</span>
            {!required ? (
              <span className={styles['label-helper']}> - opcional</span>
            ) : null}
          </label>
        )
      );
    }, [id, label, required]);

    useEffect(() => {
      setRenderedHelper(renderHelper());
    }, [renderHelper]);

    useEffect(() => {
      setRenderedLabel(renderLabel());
    }, [renderLabel]);

    const clickInput = () => {
      inputRef.current?.click();
      inputRef.current?.focus();
    };

    const getValue = () => inputRef.current!.value;

    const setValue = (value?: string) => {
      inputRef.current!.value = value ?? '';
    };

    const handleBlur = () => {
      if (!blurOnChange) setTouched(true);

      onBlur?.();
    };

    const handleChange = (event: ChangeInputEvent) => {
      if (blurOnChange) setTouched(true);

      onChange?.(event);
    };

    const controlCssClasses = () =>
      `${styles.control} ${touched && isInvalid ? styles.invalid : ''} ${
        className ?? ''
      }`;

    useImperativeHandle(ref, () => {
      return {
        clickInput: clickInput,
        setValue: setValue,
        getValue: getValue,
      };
    });

    return (
      <div className={controlCssClasses()}>
        {renderedLabel}
        <input
          ref={inputRef}
          type={type}
          id={id}
          onBlur={handleBlur}
          onChange={handleChange}
          accept={accept}
          value={value}
          placeholder={placeholder ?? ''}
          onKeyDown={(e) => onKeyDown?.(e)}
        ></input>
        {renderedHelper}
        {children}
      </div>
    );
  }
);

export default Input;
