import { Image } from '../Image';
import { Navigation } from '../Navigation';
import classes from './style.module.scss';

const MainHeader = () => {
  return (
    <header className={classes.header}>
      {/* <header> */}
      <figure>
        <Image src="/images/logo-teste.png" alt="Impar Logo" />
      </figure>
      {/* </header> */}
      <Navigation />
    </header>
  );
};

export default MainHeader;
