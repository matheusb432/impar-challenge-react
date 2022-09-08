import { ReactNode } from 'react';
import styles from './style.module.scss';

interface IconButtonProps {
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

const IconButton = ({ icon, onClick, disabled = false }: IconButtonProps) => {
  return (
    <button
      className={styles['icon-button']}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
    </button>
  );
};

export default IconButton;
