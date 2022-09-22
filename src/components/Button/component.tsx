import { CSSProperties, ReactNode } from 'react';
import { buildSpinnerSize, LoadingSpinner } from '../LoadingSpinner';
import styles from './style.module.scss';

interface ButtonProps {
  children: ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
  style?: CSSProperties;
  isLoading?: boolean;
  outlineStyle?: boolean;
  disabledReason?: string;
  colorTheme?: string;
  onClick?: () => void;
}

function Button({
  children,
  onClick,
  className,
  style,
  colorTheme,
  isLoading,
  disabledReason,
  outlineStyle,
  disabled,
  type,
}: ButtonProps) {
  return (
    <button
      type={type === 'submit' ? 'submit' : 'button'}
      disabled={disabled || isLoading}
      title={disabled ? disabledReason : ''}
      style={{
        color: colorTheme ?? '',
        border: colorTheme ? `1px solid ${colorTheme}` : '',
        ...style,
      }}
      className={`${styles.button} ${className ?? ''} ${outlineStyle ? styles.outline : ''}`}
      onClick={onClick}
    >
      <div className={styles.children}>
        {isLoading ? (
          <LoadingSpinner style={{ ...buildSpinnerSize(24), marginRight: '12px' }} />
        ) : null}
        {children}
      </div>
    </button>
  );
}

Button.defaultProps = {
  type: 'button',
  className: '',
  style: {},
  disabled: false,
  isLoading: false,
  outlineStyle: false,
  disabledReason: '',
  colorTheme: '',
  onClick: undefined,
};

export default Button;
