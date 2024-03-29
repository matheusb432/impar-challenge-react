import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon } from '../../assets/icons';
import { Backdrop } from '../Backdrop';
import { Button } from '../Button';
import styles from './style.module.scss';
import { ModalData } from './types';

export interface ModalProps {
  children: ReactNode;
  modalData: ModalData;
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoadingConfirm?: boolean;
}

export type BaseModalProps = Omit<ModalProps, 'modalData' | 'children'>;

export const Modal = ({
  children,
  modalData,
  show,
  onClose,
  isLoadingConfirm = false,
  onConfirm,
}: ModalProps) => {
  const { iconFn: icon, title, colorTheme, confirmText } = modalData;

  const iconProps = modalData.iconProps ?? { className: '' };
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
            name="modal-confirm"
            onClick={onConfirm}
            style={{
              backgroundColor: colorTheme ?? '',
              marginRight: '16px',
            }}
            isLoading={isLoadingConfirm}
          >
            {confirmText}
          </Button>
          <Button name="modal-cancel" onClick={onClose} colorTheme={colorTheme} outlineStyle>
            Cancelar
          </Button>
        </footer>
      </div>
    </>,
    document.getElementById('overlay-root')!,
  );
};
