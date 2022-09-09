import { createPortal } from 'react-dom';
import styles from './style.module.scss';

interface BackdropProps {
  bgColor?: string;
  onClick?: () => void;
}

const Backdrop = ({ bgColor, onClick }: BackdropProps) => {
  return createPortal(
    <div
      className={styles.backdrop}
      style={{ backgroundColor: bgColor ?? '' }}
      onClick={onClick}
    ></div>,
    document.getElementById('backdrop-root')!
  );
};

export default Backdrop;
