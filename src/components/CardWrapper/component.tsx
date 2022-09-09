import { ReactNode } from 'react';
import { Image } from '../Image';
import styles from './style.module.scss';

interface CardWrapperProps {
  children: ReactNode;
  image?: ImageData;
  actions?: ReactNode;
}

const CardWrapper = ({ children, image, actions }: CardWrapperProps) => {
  return (
    <>
      <article className={styles.card}>
        <div className={styles.image}>
          {image ? (
            'PLACEHOLDER'
          ) : (
            <Image src={'/images/fist-icon.svg'} alt="Fist icon" />
          )}
        </div>
        <div className={styles['vertical-dash']}></div>
        {children}
      </article>
      {actions && <div className={styles.actions}>{actions}</div>}
    </>
  );
};

export default CardWrapper;
