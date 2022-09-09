import { ReactNode } from 'react';
import { Backdrop } from '../Backdrop';
import styles from './style.module.scss';

interface SideContainerProps {
  children: ReactNode;
  onBackdropClick: () => void;
}

const SideContainer = ({ children, onBackdropClick }: SideContainerProps) => {
  // TODO Add portal to body
  return (
    <>
      <Backdrop onClick={onBackdropClick} />
      <section className={styles['side-container']}>{children}</section>
    </>
  );
};

export default SideContainer;
