import { AxiosError } from 'axios';
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Toast } from '../components/Toast';
import { ToastData } from '../components/Toast/toast-data';
import { ToastType } from '../components/Toast/toast-type.enum';
import { errorCodeToKey, errorMessages } from '../utils';

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
 * @param changeError Função para atualizar error.
 * @param toasts Lista de toasts na fila a serem exibidos em <Toast />.
 * @param showToast Função para adicionar um novo toast na fila.
 * @param nextToast Função para remover o primeiro toast da fila.
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

  const changeError = useCallback((value: ErrorType) => {
    setError(value);
  }, []);

  const showToast = useCallback(
    (text: string | ToastData, type?: ToastType, duration?: number) => {
      const data =
        text instanceof ToastData ? text : new ToastData(text, type, duration);

      setToasts((prevState) => [...prevState, data]);
    },
    []
  );

  useEffect(() => {
    if (error === null) return;

    const key =
      (error instanceof AxiosError ? errorCodeToKey(error.code) : error) ?? '';

    const errorMessage =
      errorMessages[key as keyof object] || errorMessages.default;

    showToast(ToastData.error(errorMessage));
  }, [error, showToast]);

  const nextToast = useCallback(() => {
    setToasts((prevState) => prevState.slice(1));
  }, []);

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
