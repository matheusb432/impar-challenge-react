import { ReactNode, useState } from 'react';
import { useHovering } from '../../hooks';
import styles from './style.module.scss';

interface IconButtonProps {
  icon: ReactNode;
  onClick: () => void;
  label?: string;
  disabled?: boolean;
  theme?: string;
}

const IconButton = ({
  icon,
  onClick,
  disabled = false,
  label = '',
  theme = '',
}: IconButtonProps) => {
  const { hovering, onMouseEnter, onMouseLeave } = useHovering();

  return (
    <button
      className={styles['icon-button']}
      onClick={onClick}
      disabled={disabled}
      style={{ color: hovering ? theme : '' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {icon}
      <div>{label}</div>
    </button>
  );
};

export default IconButton;
