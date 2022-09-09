import { CSSProperties, ReactNode } from 'react';
import styles from './style.module.scss';

interface ButtonProps {
  children: ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
  style?: CSSProperties;
  outlineStyle?: boolean;
  colorTheme?: string;
  onClick?: () => void;
}

const Button = ({
  children,
  onClick,
  className,
  style,
  colorTheme,
  outlineStyle = false,
  disabled = false,
  type = 'button',
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
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
      {children}
    </button>
  );
};

export default Button;
