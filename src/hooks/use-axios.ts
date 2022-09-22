import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useMutation, useQuery } from 'react-query';
import { AppContextProps } from '../store';
import { getEnvValue } from '../utils';
import { EnvKeys } from '../types/env-keys.enum';
import useAppContext from './use-app-context';

axios.defaults.baseURL = getEnvValue(EnvKeys.ApiUrl) || 'http://localhost:5000/api';

/**
 * Hook para abstrair o uso de Axios com react-query e controlar globalmente erros derivados
 * de consultas para a API.
 *
 * @param config Os paramêtros da requisição
 * @returns Uma consulta
 */
const useAxios = <T>(config: AxiosRequestConfig) => useQuery<AxiosResponse<T>, AxiosError<T>>(
  queryKey(config),
  queryFn<T>(config),
  queryOptions(useAppContext()),
);

const useAxiosMutation = <T>(config: AxiosRequestConfig) => useMutation<AxiosResponse<T>, AxiosError<T>>(
  queryKey(config),
  queryFn<T>(config),
  queryOptions(useAppContext()),
);

const queryKey = (config: AxiosRequestConfig) => [config.url, config.params].filter((x) => !!x);

const queryFn = <T>(config: AxiosRequestConfig) => () => axios.request<T>(config);

const queryOptions = (context: AppContextProps) => ({
  onError: (error: AxiosError) => {
    context.changeError(error);
  },
});

export { useAxios, useAxiosMutation };
