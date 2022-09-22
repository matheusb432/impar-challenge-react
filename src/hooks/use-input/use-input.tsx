import { ChangeEvent, useCallback, useReducer } from 'react';
import { InputElement } from '../../types';
import { initialState, InputActions, inputReducer } from './reducer';

/**
 * Hook para agrupar diversas funcionalidades de inputs de modo genérico e reutilizável
 *
 * @param validateValue Função de validação do valor do input
 */
export function useInput<TElement extends InputElement = HTMLInputElement>(
  validateValue: (value: string) => boolean
) {
  const [state, dispatch] = useReducer(inputReducer, initialState);
  const { value, touched } = state;

  const isValid = validateValue(value);
  const hasError = !isValid && touched;

  const changeHandler = (event: ChangeEvent<TElement>) => {
    dispatch({ type: InputActions.InputChange, payload: event.target.value });
  };

  const setValue = useCallback((value: string) => {
    dispatch({ type: InputActions.InputChange, payload: value });
  }, []);

  const blurHandler = () => {
    dispatch({ type: InputActions.InputBlur });
  };

  const touch = (touch = true) => {
    dispatch({ type: InputActions.InputTouch, payload: touch });
  };

  const reset = () => {
    dispatch({ type: InputActions.InputReset });
  };

  return {
    value,
    isValid,
    hasError,
    changeHandler,
    setValue,
    blurHandler,
    touch,
    reset,
  };
}
