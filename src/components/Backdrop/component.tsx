import { createPortal } from 'react-dom';
import styles from './style.module.scss';

interface BackdropProps {
  bgColor?: string;
  show?: boolean;
  onClick?: () => void;
}

const Backdrop = ({ bgColor, show = true, onClick }: BackdropProps) => {
  return createPortal(
    <div
      className={`${styles.backdrop} ${show ? styles.show : ''}`}
      style={{ backgroundColor: bgColor ?? '' }}
      onClick={onClick}
    ></div>,
    document.getElementById('backdrop-root')!
  );
};

export default Backdrop;
