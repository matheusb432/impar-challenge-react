import { ReactNode } from 'react';
import styles from './style.module.scss';

interface BackgroundImageProps {
  children: ReactNode;
}

const BackgroundImage = ({ children }: BackgroundImageProps) => {
  return <div className={styles['background-image']}>{children}</div>;
};

export default BackgroundImage;
