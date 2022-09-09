import { CSSProperties } from 'react';
import styles from './style.module.scss';

interface ButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
  style?: CSSProperties;
  outlineStyle?: boolean;
  onClick?: () => void;
}

const Button = ({
  children,
  onClick,
  className,
  style,
  outlineStyle = false,
  disabled = false,
  type = 'button',
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      style={style}
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
