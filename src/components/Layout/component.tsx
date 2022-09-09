import { ReactNode } from 'react';
import { BackgroundImage } from '../BackgroundImage';
import { MainHeader } from '../MainHeader';
import { Image } from '../Image';
import styles from './style.module.scss';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.container}>
      <MainHeader />
      {/* <Image
        src="images/people-background.png"
        alt="People hanging out in an office"
      /> */}

      <main>{children}</main>
    </div>
  );
};

export default Layout;
