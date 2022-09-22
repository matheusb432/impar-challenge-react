import { ReactNode } from 'react';
import { MainHeader } from '../MainHeader';
import styles from './style.module.scss';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.container}>
      <MainHeader />

      <main>{children}</main>
    </div>
  );
}

export default Layout;
