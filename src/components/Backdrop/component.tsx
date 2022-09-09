import styles from './style.module.scss';

interface BackdropProps {
  bgColor?: string;
  onClick?: () => void;
}

const Backdrop = ({ bgColor, onClick }: BackdropProps) => {
  return (
    <div
      className={styles.backdrop}
      style={{ backgroundColor: bgColor ?? '' }}
      onClick={onClick}
    ></div>
  );
};

export default Backdrop;
