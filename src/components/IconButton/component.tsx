import { ReactNode } from 'react';
import styles from './style.module.scss';

interface IconButtonProps {
  icon: ReactNode;
  onClick: () => void;
  label?: string;
  disabled?: boolean;
}

const IconButton = ({
  icon,
  onClick,
  disabled = false,
  label = '',
}: IconButtonProps) => {
  return (
    <button
      className={styles['icon-button']}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      <div>{label}</div>
    </button>
  );
};

export default IconButton;
