import { CSSProperties } from 'react';
import styles from './style.module.scss';

interface LoadingSpinnerProps {
  style?: CSSProperties;
}

function LoadingSpinner({ style }: LoadingSpinnerProps) {
  return (
    <div className={styles['spinner-container']}>
      <div className={styles['loading-spinner']} style={style} />
    </div>
  );
}

LoadingSpinner.defaultProps = {
  style: {},
};

export default LoadingSpinner;
