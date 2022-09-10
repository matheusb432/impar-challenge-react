import { useState } from 'react';
import styles from './style.module.scss';

const useDebounce = (filterFn: (...args: any[]) => void, timeoutMs = 500) => {
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  const debounceFn = () => {
    // c timer;
    // setTimer(timer);
    // setTimer(new Time);
    return (...args: any[]) => {
      clearTimer();

      //   setTimer(setTimeout(() => { filterFn.apply(this, args); }, timeoutMs));
      setTimer(setTimeout(() => filterFn(args), timeoutMs));
    };
  };

  const clearTimer = () => {
    clearTimeout(timer);
  };
  return { debounceFn, clearTimer };
};

export default useDebounce;
