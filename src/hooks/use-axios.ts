import { MutationFunction, useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { AppContextProps } from '../store';
import { EnvKeys } from '../types/env-keys.enum';
import { MutationRes, UseAxiosMutationOptions, UseAxiosOptions } from '../types/query-types';
import { getEnvValue } from '../utils';
import useAppContext from './use-app-context';

axios.defaults.baseURL = getEnvValue(EnvKeys.ApiUrl) || 'http://localhost:5000/api';

function useAxios<TResponse = unknown, TBody = void>(options: UseAxiosOptions<TResponse, TBody>) {
  const { config, queryOptions = {} } = options;

  return useQuery<TResponse, AxiosError<TResponse>>({
    queryKey: queryKey(config),
    queryFn: queryFn<TResponse>(config),
    ...onErrorOptions(useAppContext()),
    ...queryOptions,
  });
}

function useAxiosMutation<
  TResponse = unknown,
  TBody = unknown,
  TVariables = AxiosRequestConfig<unknown>,
>(
  options: UseAxiosMutationOptions<TResponse, TBody, TVariables>,
): MutationRes<TResponse, TVariables> {
  const { config, queryOptions = {} } = options;

  return useMutation({
    mutationKey: queryKey(config),
    mutationFn: mutationFn<TResponse, TBody, TVariables>(config),
    ...onErrorOptions<TResponse, TBody>(useAppContext()),
    ...queryOptions,
  });
}

function queryKey(config: AxiosRequestConfig) {
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
function queryFn<TResponse>(config: AxiosRequestConfig): () => Promise<TResponse> {
  return async () => {
    const res = await axios.request<TResponse>(config);

    return res.data;
  };
}

function mutationFn<TResponse, TBody, TVariables>(
  baseConfig: AxiosRequestConfig<TBody>,
): MutationFunction<TResponse, TVariables> {
  return async (requestConfig: TVariables) => {
    const res = await axios.request<TResponse>({ ...baseConfig, ...requestConfig });

    return res.data;
  };
}

function onErrorOptions<TResponse, TBody>(context: AppContextProps) {
  return {
    onError: (error: AxiosError<TResponse, TBody>) => {
      context.changeError(error);
    },
  };
}

export { buildUniqueKeyFromUrl, useAxios, useAxiosMutation };
