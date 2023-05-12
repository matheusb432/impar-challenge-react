import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from '@tanstack/react-query';
import { AppContextProps } from '../store';
import { EnvKeys } from '../types/env-keys.enum';
import { getEnvValue } from '../utils';
import useAppContext from './use-app-context';

axios.defaults.baseURL = getEnvValue(EnvKeys.ApiUrl) || 'http://localhost:5000/api';
type QueryOpts<TResponse> = Omit<
  UseQueryOptions<TResponse, AxiosError<TResponse>>,
  'queryKey' | 'queryFn'
>;
type MutationOpts<TResponse> = Omit<
  UseMutationOptions<TResponse, AxiosError<TResponse>>,
  'mutationKey' | 'mutationFn'
>;

interface UseAxiosOptions<TResponse = unknown, TBody = void> {
  config: AxiosRequestConfig<TBody>;
  queryOptions?: QueryOpts<TResponse>;
}

interface UseAxiosMutationOptions<TResponse = unknown, TBody = void> {
  config: AxiosRequestConfig<TBody>;
  queryOptions?: MutationOpts<TResponse>;
}

/**
 * Hook para abstrair o uso de Axios com react-query e controlar globalmente erros derivados
 * de consultas para a API.
 *
 * @param config Os paramêtros da requisição
 * @returns Uma consulta
 */
function useAxios<TResponse = unknown, TBody = void>(options: UseAxiosOptions<TResponse, TBody>) {
  const { config, queryOptions = {} } = options;

  return useQuery<TResponse, AxiosError<TResponse>>(queryKey(config), queryFn<TResponse>(config), {
    ...defaultOptions(useAppContext()),
    ...queryOptions,
  });
}

function useAxiosMutation<TResponse = unknown, TBody = void>(
  options: UseAxiosMutationOptions<TResponse, TBody>,
) {
  const { config, queryOptions = {} } = options;

  return useMutation<TResponse, AxiosError<TResponse>>(
    queryKey(config),
    queryFn<TResponse>(config),
    { ...defaultOptions(useAppContext()), ...queryOptions },
  );
}

function queryKey(config: AxiosRequestConfig) {
  return [config.url, config.params].filter((x) => !!x);
}

/**
 * Função que retorna uma função que faz uma requisição mapeada para a API.
 *
 * @param config Os paramêtros da requisição
 * @returns Uma função que faz a requisição para a API
 */
function queryFn<TResponse>(config: AxiosRequestConfig): () => Promise<TResponse> {
  return async () => {
    const res = await axios.request<TResponse>(config);

    return res.data;
  };
}

const defaultOptions = (context: AppContextProps) => ({
  onError: (error: AxiosError) => {
    context.changeError(error);
  },
});

export { useAxios, useAxiosMutation };

export type { MutationOpts, QueryOpts, UseAxiosMutationOptions, UseAxiosOptions };
