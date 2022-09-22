import { ReactNode } from 'react';
import { Container } from '../Container';
import styles from './style.module.scss';

interface BackgroundImageProps {
  children: ReactNode;
}

function BackgroundImage({ children }: BackgroundImageProps) {
  return (
    <div className={styles['background-image']}>
      <Container>{children}</Container>
    </div>
  );
}

export default BackgroundImage;
