import {
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosError, AxiosRequestConfig } from 'axios';

type QueryOpts<TResponse> = Omit<
  UseQueryOptions<TResponse, AxiosError<TResponse>>,
  'queryKey' | 'queryFn'
>;
type MutationOpts<TResponse, TBody, TVariables = AxiosRequestConfig<TBody>> = Omit<
  UseMutationOptions<TResponse, AxiosError<TResponse>, TVariables>,
  'mutationKey' | 'mutationFn'
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
  queryOptions?: MutationOpts<TResponse, TBody, TVariables>;
}

export type {
  QueryOpts,
  MutationOpts,
  QueryRes,
  MutationRes,
  UseAxiosOptions,
  UseAxiosMutationOptions,
};
