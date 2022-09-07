import { Image } from '../Image';
import classes from './style.module.scss';

const Header = () => {
  return (
    <nav className={classes.nav}>
      <header>
        <Image src="images/logo-teste.png" alt="Impar Logo" />
      </header>
    </nav>
  );
};

export default Header;
