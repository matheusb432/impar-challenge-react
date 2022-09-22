import { RouteUrls } from '../../types';
import { NavItem } from '../NavItem';
import styles from './style.module.scss';

const urls = RouteUrls;

function Navigation() {
  return (
    <nav className={styles.nav}>
      <ul className={styles['nav-items']}>
        <NavItem url={urls.Cards}>Cards</NavItem>
      </ul>
    </nav>
  );
}

export default Navigation;
