import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { RouteUrls } from '../../types';
import styles from './style.module.scss';

interface NavItemProps {
  children: ReactNode;
  url: RouteUrls;
}

function NavItem({ children, url }: NavItemProps) {
  return (
    <li className={styles['nav-item']}>
      <NavLink
        to={url}
        className={({ isActive }) => (isActive ? styles.active : '')}
      >
        {children}
      </NavLink>
    </li>
  );
}

export default NavItem;
