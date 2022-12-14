import { createPortal } from 'react-dom';
import styles from './style.module.scss';

interface BackdropProps {
  bgColor?: string;
  show?: boolean;
  animationMs?: number;
  onClick?: () => void;
}

const Backdrop = ({ bgColor, show = true, animationMs = 500, onClick }: BackdropProps) =>
  createPortal(
    <div
      className={`${styles.backdrop} ${show ? styles.show : ''}`}
      style={{
        backgroundColor: bgColor ?? '',
        transitionDuration: `${animationMs / 1000}s`,
      }}
      onClick={onClick}
      aria-hidden="true"
    />,
    document.getElementById('backdrop-root')!,
  );

export default Backdrop;
