import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Backdrop } from '../Backdrop';
import { Button } from '../Button';
import styles from './style.module.scss';
import { ModalData } from './types';

interface ModalProps {
  children: ReactNode;
  modalData: ModalData;
  show: boolean;
  closeModal: () => void;
}

const Modal = ({ children, modalData, show, closeModal }: ModalProps) => {
  const { iconFn: icon, title, colorTheme, confirmText } = modalData;

  let iconProps = modalData.iconProps ?? { className: '' };
  iconProps.className += ` ${styles.icon}`;

  // TODO Add X on modal
  return show
    ? createPortal(
        <>
          <Backdrop />
          <div className={styles.modal}>
            <header className={styles.header}>
              <div
                className={styles['icon-container']}
                style={{ backgroundColor: colorTheme && `${colorTheme}0f` }}
              >
                {icon(iconProps)}
              </div>
              <h2>{title}</h2>
            </header>
            <article className={styles.body}>{children}</article>
            <footer className={styles.footer}>
              <Button
                style={{
                  backgroundColor: colorTheme ?? '',
                  marginRight: '16px',
                }}
              >
                {confirmText}
              </Button>
              <Button colorTheme={colorTheme} outlineStyle={true}>
                Cancelar
              </Button>
            </footer>
          </div>
        </>,
        document.getElementById('overlay-root')!
      )
    : null;
};

export default Modal;
