import { useRef } from 'react';

function useElementRef<T = HTMLInputElement>() {
  return useRef<T | null>(null);
}

export default useElementRef;
