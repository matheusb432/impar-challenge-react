import { useQueryClient } from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';
import { HttpMethods, ODataParams, PostReturn } from '../types';
import {
  MutationOpts,
  QueryConfig,
  QueryOpts,
  QueryRes,
  UseApiMutationOptions,
} from '../types/query-types';
import { axiosRequest, buildKeyFromUrl, useAxios, useAxiosMutation } from './use-axios';

/**
 * Hook criador de todas as possíveis requisições para endpoints da API
 *
 * @returns Objeto com referências às funções de requisições.
 */

export function useApi<TEntity>(featureUrl: string) {
  const client = useQueryClient();
  const baseQueryKey = buildKeyFromUrl(featureUrl);

  type PostEntity = Omit<TEntity, 'id'>;

  function useGet<TResponse = TEntity, TParams = object>(
    queryOptions?: QueryOpts<TResponse, TParams>,
  ) {
    return useAxios({
      config: buildQueryConfig(queryOptions?.reqConfig),
      queryOptions,
    });
  }

  function useOData<TResponse = TEntity[]>(
    params: ODataParams,
    queryOptions?: Omit<QueryOpts<TResponse, ODataParams>, 'reqConfig'>,
  ): QueryRes<TResponse> {
    return useGet({
      ...queryOptions,
      reqConfig: {
        urlSuffix: '/odata',
        params,
      },
    });
  }

  function useApiMutation<TResponse = void, TBody = unknown, TVariables = unknown>(
    options: UseApiMutationOptions<TResponse, TBody, TVariables>,
  ) {
    const { queryOptions, config, initialMutationFn } = options;
    const baseConfig = {
      url: featureUrl,
    };

    return useAxiosMutation({
      mutationFn: (payload: TVariables) =>
        initialMutationFn(payload, {
          ...baseConfig,
          ...config,
        }),
      ...queryOptions,
    });
  }

  function usePost(queryOptions?: MutationOpts<PostReturn, PostEntity>) {
    return useApiMutation({
      config: {
        method: HttpMethods.Post,
      },
      initialMutationFn: postFn,
      queryOptions,
    });
  }

  function usePut(queryOptions?: MutationOpts<void, TEntity, { id: number; body: TEntity }>) {
    return useApiMutation({
      config: {
        method: HttpMethods.Put,
      },
      initialMutationFn: putFn,
      queryOptions,
    });
  }

  function useRemove(queryOptions?: MutationOpts<void, number>) {
    return useApiMutation({
      config: {
        method: HttpMethods.Delete,
      },
      initialMutationFn: deleteFn,
      queryOptions: {
        ...queryOptions,
      },
    });
  }

  function postFn(body: PostEntity, baseConfig?: AxiosRequestConfig) {
    return axiosRequest<PostReturn, PostEntity>({
      ...baseConfig,
      url: featureUrl,
      data: body,
    });
  }

  function putFn(payload: { id: number; body: TEntity }, baseConfig?: AxiosRequestConfig) {
    const { id, body } = payload;
    return axiosRequest<void, TEntity>({
      ...baseConfig,
      url: `${featureUrl}/${id}`,
      data: body,
    });
  }

  function deleteFn(id: number, baseConfig?: AxiosRequestConfig) {
    return axiosRequest<void, number>({
      ...baseConfig,
      url: `${featureUrl}/${id}`,
    });
  }

  function invalidateFeatureQueries(): Promise<void> {
    return client.invalidateQueries(baseQueryKey);
  }

  function buildQueryConfig(reqConfig?: QueryConfig<unknown>) {
    const { urlSuffix = '', params } = reqConfig || {};

    return {
      url: `${featureUrl}${urlSuffix}`,
      method: HttpMethods.Get,
      params,
    };
  }

  return {
    useGet,
    useOData,
    useApiMutation,
    usePost,
    usePut,
    useRemove,
    baseQueryKey,
    invalidateFeatureQueries,
  };
}
