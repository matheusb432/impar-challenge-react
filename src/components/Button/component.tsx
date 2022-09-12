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

const Button = ({
  children,
  onClick,
  className,
  style,
  colorTheme,
  isLoading = false,
  disabledReason = '',
  outlineStyle = false,
  disabled = false,
  type = 'button',
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      title={disabled ? disabledReason : ''}
      style={{
        color: colorTheme ?? '',
        border: colorTheme ? `1px solid ${colorTheme}` : '',
        ...style,
      }}
      className={`${styles.button} ${className ?? ''} ${
        outlineStyle ? styles.outline : ''
      }`}
      onClick={onClick}
    >
      <div className={styles.children}>
        {isLoading ? (
          <LoadingSpinner
            style={{ ...buildSpinnerSize(24), marginRight: '12px' }}
          />
        ) : null}
        {children}
      </div>
    </button>
  );
};

export default Button;
