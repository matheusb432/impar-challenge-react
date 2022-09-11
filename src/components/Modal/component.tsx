import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon } from '../../assets/icons';
import { Backdrop } from '../Backdrop';
import { Button } from '../Button';
import styles from './style.module.scss';
import { ModalData } from './types';

interface ModalProps {
  children: ReactNode;
  modalData: ModalData;
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const Modal = ({
  children,
  modalData,
  show,
  onClose,
  onConfirm,
}: ModalProps) => {
  const { iconFn: icon, title, colorTheme, confirmText } = modalData;

  let iconProps = modalData.iconProps ?? { className: '' };
  iconProps.className += ` ${styles.icon}`;

  return createPortal(
    <>
      <Backdrop onClick={onClose} show={show} />
      <div className={`${styles.modal} ${show ? styles.visible : ''}`}>
        <header className={styles.header}>
          <CloseIcon onClick={onClose} className={styles['close-icon']} />
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
            onClick={onConfirm}
            style={{
              backgroundColor: colorTheme ?? '',
              marginRight: '16px',
            }}
          >
            {confirmText}
          </Button>
          <Button onClick={onClose} colorTheme={colorTheme} outlineStyle={true}>
            Cancelar
          </Button>
        </footer>
      </div>
    </>,
    document.getElementById('overlay-root')!
  );
};

export default Modal;
