import { ReactNode } from 'react';
import { Backdrop } from '../Backdrop';
import styles from './style.module.scss';

interface SideContainerProps {
  children: ReactNode;
  show?: boolean;
  onClose: () => void;
}

const SideContainer = ({
  children,
  onClose,
  show = true,
}: SideContainerProps) => {
  return (
    <>
      <Backdrop onClick={onClose} show={show} />
      <section
        className={`${styles['side-container']} ${show ? styles.visible : ''}`}
      >
        {children}
      </section>
    </>
  );
};

export default SideContainer;
