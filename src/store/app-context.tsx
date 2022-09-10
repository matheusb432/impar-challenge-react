import { AxiosError } from 'axios';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { SharedErrorKeys } from '../types';
import { errorCodeToKey, errorMessages } from '../utils';

type ErrorType = Error | null | string;

export interface AppContextProps {
  error: ErrorType;
  changeError: (error: ErrorType) => void;
}

interface AppContextProviderProps {
  children: ReactNode;
}

const AppContext = createContext<AppContextProps>({
  error: null,
  changeError: (error: ErrorType) => {},
});

const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [error, setError] = useState<ErrorType>(null);

  useEffect(() => {
    if (error === null) return;

    const key =
      (error instanceof AxiosError ? errorCodeToKey(error.code) : error) ?? '';

    const errorMessage =
      errorMessages[key as keyof object] || 'Something went wrong!';

    // TODO toast error here
    console.log(errorMessage);
  }, [error]);

  const changeError = (value: ErrorType) => {
    setError(value);
  };

  return (
    <AppContext.Provider value={{ error, changeError }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
export { AppContextProvider };
