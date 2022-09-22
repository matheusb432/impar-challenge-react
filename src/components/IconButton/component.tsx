import { ReactNode } from 'react';
import { useHovering } from '../../hooks';
import styles from './style.module.scss';

interface IconButtonProps {
  icon: ReactNode;
  onClick: () => void;
  label?: string;
  disabled?: boolean;
  theme?: string;
}

function IconButton({ icon, onClick, disabled, label, theme }: IconButtonProps) {
  const { hovering, onMouseEnter, onMouseLeave } = useHovering();

  return (
    <button
      type="button"
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
}

IconButton.defaultProps = {
  disabled: false,
  label: '',
  theme: '',
};

export default IconButton;
