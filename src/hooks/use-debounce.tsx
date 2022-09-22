import { useState } from 'react';

const useDebounce = (filterFn: (...args: any[]) => void, timeoutMs = 500) => {
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  const debounceFn = () => (...args: any[]) => {
    clearTimer();

    setTimer(setTimeout(() => filterFn(args), timeoutMs));
  };

  const clearTimer = () => {
    clearTimeout(timer);
  };
  return { debounceFn, clearTimer };
};

export default useDebounce;
