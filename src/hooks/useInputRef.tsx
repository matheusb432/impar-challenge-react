import { useRef } from 'react';

function useInputRef<T = HTMLInputElement>() {
  return useRef<T | null>(null);
}

export default useInputRef;
