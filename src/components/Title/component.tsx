import { CSSProperties } from 'react';
import styles from './style.module.scss';

interface TitleProps {
  text: string;
  style?: CSSProperties;
}

function Title({ text, style }: TitleProps) {
  return (
    <h2 className={styles.title} style={style}>
      {text}
    </h2>
  );
}

Title.defaultProps = {
  style: {},
};

export default Title;
