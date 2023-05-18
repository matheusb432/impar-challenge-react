import {
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosError, AxiosRequestConfig } from 'axios';

type QueryOpts<TResponse> = UseQueryOptions<TResponse, AxiosError<TResponse>>;
type MutationOpts<TResponse, TBody, TVariables = TBody> = UseMutationOptions<
  TResponse,
  AxiosError<TResponse>,
  TVariables
>;

type QueryRes<TResponse = unknown> = UseQueryResult<TResponse, AxiosError<TResponse>>;

type MutationRes<TResponse = unknown, TVariables = unknown> = UseMutationResult<
  TResponse,
  AxiosError<TResponse>,
  TVariables
>;

interface UseAxiosOptions<TResponse = unknown, TBody = void> {
  config: AxiosRequestConfig<TBody>;
  queryOptions?: QueryOpts<TResponse>;
}

interface UseAxiosMutationOptions<TResponse = unknown, TBody = void, TVariables = void> {
  config: AxiosRequestConfig<TBody>;
  queryOptions?: Omit<MutationOpts<TResponse, TBody, TVariables>, 'mutationFn' | 'mutationKey'>;
}

interface UseApiMutationOptions<TResponse, TBody, TVariables> {
  initialMutationFn: (vars: TVariables, config: AxiosRequestConfig<TBody>) => Promise<TResponse>;
  queryOptions?: Omit<MutationOpts<TResponse, TVariables>, 'mutationFn'>;
  config?: AxiosRequestConfig<TBody>;
}

export type {
  QueryOpts,
  MutationOpts,
  QueryRes,
  MutationRes,
  UseAxiosOptions,
  UseAxiosMutationOptions,
  UseApiMutationOptions,
};
