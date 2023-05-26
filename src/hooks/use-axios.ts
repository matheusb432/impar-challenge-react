import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { AppContextProps } from '../store';
import { EnvKeys } from '../types/env-keys.enum';
import { MutationOpts, UseAxiosOptions } from '../types/query-types';
import { getEnvValue } from '../utils';
import useAppContext from './use-app-context';

axios.defaults.baseURL = getEnvValue(EnvKeys.ApiUrl) || 'http://localhost:5000/api';

export function useAxios<TResponse = unknown, TBody = void, TParams = object>(
  options: UseAxiosOptions<TResponse, TBody, TParams>,
) {
  const { config, queryOptions = {} } = options;

  return useQuery<TResponse, AxiosError<TResponse>>({
    queryKey: buildKeyFromConfig(config),
    queryFn: defaultQueryFn<TResponse>(config),
    onError: onErrorOptions(useAppContext()),
    ...queryOptions,
  });
}

export function useAxiosMutation<TResponse, TBody, TVariables>(
  queryOptions: MutationOpts<TResponse, TBody, TVariables>,
) {
  return useMutation({
    onError: onErrorOptions<TResponse, TBody>(useAppContext()),
    ...queryOptions,
  });
}

export function buildKeyFromConfig(config: AxiosRequestConfig) {
  const { url, params } = config;
  return [...buildKeyFromUrl(url), params].filter((x) => !!x);
}

export function buildKeyFromUrl(url: string | undefined): string[] {
  return url?.split('/')?.filter((x) => !!x) || [];
}

/**
 * Função que retorna uma função que faz uma requisição mapeada para a API.
 *
 * @param config Os paramêtros da requisição
 * @returns Uma função que faz a requisição para a API
 */
export function defaultQueryFn<TResponse>(config: AxiosRequestConfig): () => Promise<TResponse> {
  return async () => {
    const res = await axios.request<TResponse>(config);

    return res.data;
  };
}

export async function axiosRequest<TResponse, TVariables>(
  requestConfig: AxiosRequestConfig<TVariables>,
) {
  const res = await axios.request<TResponse>(requestConfig);

  return res.data;
}

function onErrorOptions<TResponse, TBody>(context: AppContextProps) {
  return (error: AxiosError<TResponse, TBody>) => {
    context.changeError(error);
  };
}
