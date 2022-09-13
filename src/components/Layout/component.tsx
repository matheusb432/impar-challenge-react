import { ReactNode } from 'react';
import { MainHeader } from '../MainHeader';
import { Toast } from '../Toast';
import styles from './style.module.scss';
interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <div className={styles.container}>
        <MainHeader />

        <main>{children}</main>
      </div>
    </>
  );
};

export default Layout;
