import { AxiosError } from 'axios';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { Toast } from '../components/Toast';
import { ToastData } from '../components/Toast/toast-data';
import { ToastType } from '../components/Toast/toast-type.enum';
import { deepClone, errorCodeToKey, errorMessages } from '../utils';

type ErrorType = Error | null | string;

export interface AppContextProps {
  error: ErrorType;
  changeError: (error: ErrorType) => void;
  toasts: ToastData[];
  showToast: (
    text: string | ToastData,
    type?: ToastType,
    duration?: number
  ) => void;
  nextToast: () => void;
}

interface AppContextProviderProps {
  children: ReactNode;
}

/**
 * Contexto de dados para gerenciar estados globais da aplicação
 *
 * @param error Estado mais recente de erro na aplicação.
 * @param changeError função para atualizar error.
 */
const AppContext = createContext<AppContextProps>({
  error: null,
  changeError: (error: ErrorType) => {},
  toasts: [],
  showToast: (
    text: string | ToastData,
    type?: ToastType,
    duration?: number
  ) => {},
  nextToast: () => {},
});

const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [error, setError] = useState<ErrorType>(null);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  useEffect(() => {
    if (error === null) return;

    const key =
      (error instanceof AxiosError ? errorCodeToKey(error.code) : error) ?? '';

    const errorMessage =
      errorMessages[key as keyof object] || errorMessages.default;

    showToast(ToastData.error(errorMessage));
  }, [error]);

  const changeError = (value: ErrorType) => {
    setError(value);
  };

  const showToast = (
    text: string | ToastData,
    type?: ToastType,
    duration?: number
  ) => {
    const data =
      text instanceof ToastData ? text : new ToastData(text, type, duration);

    setToasts((prevState) => [...prevState, data]);
  };

  const nextToast = () => {
    if (toasts.length === 0) return;

    setToasts((prevState) => prevState.slice(1));
  };

  return (
    <AppContext.Provider
      value={{ error, changeError, toasts, showToast, nextToast }}
    >
      {children}
      <Toast />
    </AppContext.Provider>
  );
};

export default AppContext;
export { AppContextProvider };
