import { ReactNode } from 'react';
import { base64Format } from '../../utils';
import { Image } from '../Image';
import styles from './style.module.scss';

interface CardWrapperProps {
  children: ReactNode;
  base64?: string;
  fallbackImageSrc?: string;
  actions?: ReactNode;
}

function CardWrapper({ children, base64, fallbackImageSrc, actions }: CardWrapperProps) {
  return (
    <>
      <article className={styles.card}>
        <div className={styles.image}>
          <Image
            src={base64 ? base64Format(base64) : fallbackImageSrc!}
            alt={base64 ? '' : 'Fist icon'}
            width={96}
            height={96}
            circular
          />
        </div>
        <div className={styles['vertical-dash']} />
        {children}
      </article>
      {actions && <div className={styles.actions}>{actions}</div>}
    </>
  );
}

CardWrapper.defaultProps = {
  base64: '',
  fallbackImageSrc: '/images/fist-icon.svg',
  actions: undefined,
};

export default CardWrapper;
