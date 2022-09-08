import styles from './style.module.scss';

interface ButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
  onClick?: () => void;
}

const Button = ({
  children,
  onClick,
  className,
  disabled = false,
  type = 'submit',
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${styles.button} ${className ?? ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
