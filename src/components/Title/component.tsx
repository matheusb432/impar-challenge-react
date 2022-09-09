import { CSSProperties } from 'react';
import styles from './style.module.scss';

interface TitleProps {
  text: string;
  style?: CSSProperties;
}

const Title = ({ text, style }: TitleProps) => {
  return (
    <h2 className={styles.title} style={style}>
      {text}
    </h2>
  );
};

export default Title;
