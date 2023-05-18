import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { AppContextProps } from '../store';
import { EnvKeys } from '../types/env-keys.enum';
import {
  MutationOpts,
  MutationRes,
  UseAxiosMutationOptions,
  UseAxiosOptions,
} from '../types/query-types';
import { getEnvValue } from '../utils';
import useAppContext from './use-app-context';

axios.defaults.baseURL = getEnvValue(EnvKeys.ApiUrl) || 'http://localhost:5000/api';

function useAxios<TResponse = unknown, TBody = void>(options: UseAxiosOptions<TResponse, TBody>) {
  const { config, queryOptions = {} } = options;

  return useQuery<TResponse, AxiosError<TResponse>>({
    queryKey: defaultQueryKey(config),
    queryFn: defaultQueryFn<TResponse>(config),
    ...onErrorOptions(useAppContext()),
    ...queryOptions,
  });
}

function useDefaultAxiosMutation<TResponse = unknown, TBody = unknown, TVariables = unknown>(
  options: UseAxiosMutationOptions<TResponse, TBody, TVariables>,
): MutationRes<TResponse, TVariables> {
  const { config, queryOptions = {} } = options;

  return useMutation({
    mutationKey: defaultQueryKey(config),
    mutationFn: (requestConfig: TVariables) =>
      axiosRequest<TResponse, TBody>({ ...config, ...requestConfig }),
    ...onErrorOptions<TResponse, TBody>(useAppContext()),
    ...queryOptions,
  });
}

function useAxiosMutation<TResponse, TBody, TVariables>(
  queryOptions: MutationOpts<TResponse, TBody, TVariables>,
) {
  return useMutation({
    ...queryOptions,
  });
}

function defaultQueryKey(config: AxiosRequestConfig) {
  const { url, params } = config;
  return [...buildUniqueKeyFromUrl(url), params].filter((x) => !!x);
}

function buildUniqueKeyFromUrl(url: string | undefined): string[] {
  return url?.split('/')?.filter((x) => !!x) || [];
}

/**
 * Função que retorna uma função que faz uma requisição mapeada para a API.
 *
 * @param config Os paramêtros da requisição
 * @returns Uma função que faz a requisição para a API
 */
function defaultQueryFn<TResponse>(config: AxiosRequestConfig): () => Promise<TResponse> {
  return async () => {
    const res = await axios.request<TResponse>(config);

    return res.data;
  };
}

async function axiosRequest<TResponse, TVariables>(requestConfig: AxiosRequestConfig<TVariables>) {
  const res = await axios.request<TResponse>(requestConfig);

  return res.data;
}

function onErrorOptions<TResponse, TBody>(context: AppContextProps) {
  return {
    onError: (error: AxiosError<TResponse, TBody>) => {
      context.changeError(error);
    },
  };
}

export {
  axiosRequest,
  buildUniqueKeyFromUrl,
  defaultQueryFn,
  useAxios,
  useDefaultAxiosMutation,
  useAxiosMutation,
};
