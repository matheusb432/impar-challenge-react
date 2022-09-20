import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon } from '../../assets/icons';
import { useAppContext, useElementRef } from '../../hooks';
import styles from './style.module.scss';

const Toast = () => {
  const toastRef = useElementRef<HTMLDivElement>();
  const { toasts, nextToast } = useAppContext();
  const toast = toasts?.[0];

  const [toastTimeout, setToastTimeout] = useState<NodeJS.Timeout | null>(null);
  const [toastStyles, setToastStyles] = useState<string>('');

  const getToastStyles = useCallback(() => {
    return `${styles.toast} ${toast ? styles[toast.type] : ''} ${
      toast != null && toastTimeout != null ? styles.show : ''
    }`;
  }, [toast, toastTimeout]);

  const activateNextToast = useCallback(() => {
    clearTimeout(toastTimeout!);

    setToastTimeout(null);
  }, [toastTimeout]);

  useEffect(() => {
    setToastStyles(getToastStyles());
  }, [getToastStyles]);

  useEffect(() => {
    if (toastTimeout !== null) return;

    nextToast();
  }, [nextToast, toastTimeout]);

  useEffect(() => {
    if (!toast || toastTimeout !== null) return;

    const { durationMs } = toast;

    setToastTimeout(
      setTimeout(() => {
        activateNextToast();
      }, durationMs)
    );
  }, [activateNextToast, toast, toastTimeout]);

  const handleCloseClick = () => {
    activateNextToast();
  };

  if (toastTimeout != null && toast == null) {
    clearTimeout(toastTimeout);

    activateNextToast();
  }

  return createPortal(
    <div ref={toastRef} className={toastStyles}>
      {toast?.text ?? ''}
      <div className={styles.actions}>
        <CloseIcon
          className={styles['close-icon']}
          onClick={handleCloseClick}
        />
      </div>
    </div>,
    document.getElementById('overlay-root')!
  );
};

export default Toast;
