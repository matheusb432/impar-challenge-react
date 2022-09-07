import { Image } from '../Image';
import classes from './style.module.scss';

const Header = () => {
  return (
    // NOTE adding auth context with consumer wrapper approach (not common)
    // <AuthContext.Consumer>
    //   {(ctx) => (
    <nav className={classes.nav}>
      <Image src="images/logo-teste.png" alt="Impar Logo" />
    </nav>
  );
};
// </AuthContext.Consumer>

export default Header;
