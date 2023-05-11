import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from 'react-query';
import { AppContextProps } from '../store';
import { getEnvValue } from '../utils';
import { EnvKeys } from '../types/env-keys.enum';
import useAppContext from './use-app-context';

axios.defaults.baseURL = getEnvValue(EnvKeys.ApiUrl) || 'http://localhost:5000/api';

type QueryOpts<TResponse> = Omit<
  UseQueryOptions<AxiosResponse<TResponse>, AxiosError<TResponse>>,
  'queryKey' | 'queryFn'
>;
type MutationOpts<TResponse> = Omit<
  UseMutationOptions<AxiosResponse<TResponse>, AxiosError<TResponse>>,
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

  return useQuery<AxiosResponse<TResponse>, AxiosError<TResponse>>(
    queryKey(config),
    queryFn<TResponse, TBody>(config),
    { ...defaultOptions(useAppContext()), ...queryOptions },
  );
}

function useAxiosMutation<TResponse = unknown, TBody = void>(
  options: UseAxiosMutationOptions<TResponse, TBody>,
) {
  const { config, queryOptions = {} } = options;

  return useMutation<AxiosResponse<TResponse>, AxiosError<TResponse>>(
    queryKey(config),
    queryFn<TResponse, TBody>(config),
    { ...defaultOptions(useAppContext()), ...queryOptions },
  );
}

// function useAxiosGet<TResponse>(config: AxiosRequestConfig<void>) {
//   return useAxios<TResponse, void>({
//     ...config,
//     method: 'GET',
//   });
// }

// function useAxiosPost<TResponse, TBody>(config: AxiosRequestConfig<TBody>) {
//   return useAxiosMutation<TResponse, TBody>({
//     ...config,
//     method: 'POST',
//   });
// }

// function useAxiosPut<TBody>(config: AxiosRequestConfig<TBody>) {
//   return useAxiosMutation<void, TBody>({
//     ...config,
//     method: 'PUT',
//   });
// }

// function useAxiosDelete(config: AxiosRequestConfig<void>) {
//   return useAxiosMutation<void, void>({
//     ...config,
//     method: 'DELETE',
//   });
// }

function queryKey(config: AxiosRequestConfig) {
  return [config.url, config.params].filter((x) => !!x);
}
function queryFn<TResponse, TBody>(
  config: AxiosRequestConfig,
): () => Promise<AxiosResponse<TResponse, TBody>> {
  return () => axios.request<TResponse>(config);
}

const defaultOptions = (context: AppContextProps) => ({
  onError: (error: AxiosError) => {
    context.changeError(error);
  },
});

export {
  useAxios,
  useAxiosMutation,
  // useAxiosGet, useAxiosPost, useAxiosPut, useAxiosDelete
};

export type { QueryOpts, MutationOpts, UseAxiosOptions, UseAxiosMutationOptions };
