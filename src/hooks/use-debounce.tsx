import { useCallback, useState } from 'react';

const useDebounce = (filterFn: (...args: any[]) => void, timeoutMs = 500) => {
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  const clearTimer = useCallback(() => {
    clearTimeout(timer);
  }, []);

  const debounceFn = useCallback(
    () =>
      (...args: any[]) => {
        clearTimer();

        setTimer(setTimeout(() => filterFn(args), timeoutMs));
      },
    [],
  );

  return { debounceFn, clearTimer };
};

export default useDebounce;
