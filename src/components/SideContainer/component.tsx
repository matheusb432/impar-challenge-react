import { ReactNode } from 'react';
import { Backdrop } from '../Backdrop';
import styles from './style.module.scss';

interface SideContainerProps {
  children: ReactNode;
  show?: boolean;
  animationMs?: number;
  onClose: () => void;
}

function SideContainer({
  children,
  onClose,
  animationMs = 500,
  show = true,
}: SideContainerProps) {
  return (
    <>
      <Backdrop animationMs={animationMs} onClick={onClose} show={show} />
      <section
        className={`${styles['side-container']} ${show ? styles.visible : ''}`}
        style={{ transitionDuration: `${animationMs / 1000}s` }}
      >
        {children}
      </section>
    </>
  );
}

export default SideContainer;
