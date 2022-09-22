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
import { useElementRef } from '../../hooks';
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
  hasError?: boolean;
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
      hasError = false,
    }: InputProps,
    ref
  ) => {
    const [renderedHelper, setRenderedHelper] = useState<DynamicJsx>();
    const [renderedLabel, setRenderedLabel] = useState<DynamicJsx>();
    const inputRef = useElementRef();

    const renderHelper = useCallback(() => {
      return (
        (showHelperIfValid || hasError) &&
        validateText(helperText) && (
          <span className={styles.helper}>{helperText}</span>
        )
      );
    }, [hasError, helperText, showHelperIfValid]);

    const renderLabel = useCallback(() => {
      return (
        validateText(label) && (
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

    const handleBlur = () => {
      // TODO add on hook?
      // if (!blurOnChange) setTouched(true);

      onBlur?.();
    };

    const handleChange = (event: ChangeInputEvent) => {
      // TODO add on hook?
      // if (blurOnChange) setTouched(true);

      onChange?.(event);
    };

    const controlCssClasses = () =>
      `${styles.control} ${hasError ? styles.invalid : ''} ${className ?? ''}`;

    useImperativeHandle(ref, () => {
      return {
        clickInput: clickInput,
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
