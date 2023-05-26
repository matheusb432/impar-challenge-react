import { UseMutationOptions, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { AxiosError, AxiosRequestConfig } from 'axios';

export type QueryConfig<TParams> = { urlSuffix?: string; params?: TParams };

export type QueryOpts<TResponse, TParams> = { reqConfig: QueryConfig<TParams> } & UseQueryOptions<
  TResponse,
  AxiosError<TResponse>
>;
export type MutationOpts<TResponse, TBody, TVariables = TBody> = UseMutationOptions<
  TResponse,
  AxiosError<TResponse>,
  TVariables
>;

export type QueryRes<TResponse = unknown> = UseQueryResult<TResponse, AxiosError<TResponse>>;

export interface UseAxiosOptions<TResponse = unknown, TBody = void, TParams = object> {
  config: AxiosRequestConfig<TBody>;
  queryOptions?: QueryOpts<TResponse, TParams>;
}

export interface UseApiMutationOptions<TResponse, TBody, TVariables> {
  initialMutationFn: (vars: TVariables, config: AxiosRequestConfig<TBody>) => Promise<TResponse>;
  queryOptions?: Omit<MutationOpts<TResponse, TVariables>, 'mutationFn'>;
  config?: AxiosRequestConfig<TBody>;
}
