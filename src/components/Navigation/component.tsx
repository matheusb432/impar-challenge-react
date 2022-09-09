import { Link } from 'react-router-dom';
import { RouteUrls } from '../../types';
import { NavItem } from '../NavItem';
import styles from './style.module.scss';

const urls = RouteUrls;

const Navigation = () => {
  return (
    <nav className={styles.nav}>
      <ul className={styles['nav-items']}>
        <NavItem url={urls.Home}>Home</NavItem>
        <NavItem url={urls.Cards}>Cards</NavItem>
      </ul>
    </nav>
  );
};

export default Navigation;
