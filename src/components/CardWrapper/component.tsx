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
    <article>
      {image ? (
        'PLACEHOLDER'
      ) : (
        <Image src={'images/fist-icon.svg'} alt="Fist icon" />
      )}
      {children}
      {actions && <div>{actions}</div>}
    </article>
  );
};

export default CardWrapper;
