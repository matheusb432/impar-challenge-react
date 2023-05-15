import { useQueryClient } from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';
import { HttpMethods, ODataParams, PostReturn } from '../types';
import { buildUniqueKeyFromUrl, useAxios, useAxiosMutation } from './use-axios';
import { MutationOpts, MutationRes, QueryOpts, QueryRes } from '../types/query-types';
import { transformMutateFns } from '../utils';

/**
 * Hook criador de todas as possíveis requisições para endpoints da API
 *
 * @returns Objeto com referências às funções de requisições.
 */

export function useApi<TEntity>(featureUrl: string) {
  const client = useQueryClient();
  const baseQueryKey = buildUniqueKeyFromUrl(featureUrl);

  type PostEntity = Omit<TEntity, 'id'>;

  function useGet<TResponse = TEntity>(
    urlSuffix = '',
    params: Record<string, any> = {},
    queryOptions?: QueryOpts<TResponse>,
  ): QueryRes<TResponse> {
    return useAxios<TResponse>({
      config: {
        url: `${featureUrl}${urlSuffix}`,
        method: HttpMethods.Get,
        params,
      },
      queryOptions,
    });
  }

  function useOData<TResponse = TEntity[]>(
    params: ODataParams,
    queryOptions?: QueryOpts<TResponse>,
  ): QueryRes<TResponse> {
    return useGet('/odata', params, queryOptions);
  }

  function useApiMutation<TResponse = void, TBody = unknown>(
    config: AxiosRequestConfig,
    queryOptions?: MutationOpts<TResponse, TBody>,
  ): MutationRes<TResponse, AxiosRequestConfig<TBody>> {
    return useAxiosMutation({
      config: {
        url: featureUrl,
        ...config,
      },
      queryOptions: {
        onSettled: invalidateFeatureQueries,
        ...queryOptions,
      },
    });
  }

  function usePost<TResponse = PostReturn>(
    queryOptions?: MutationOpts<TResponse, PostEntity>,
  ): MutationRes<TResponse, PostEntity> {
    const mutation = useAxiosMutation({
      config: {
        url: featureUrl,
        method: HttpMethods.Post,
      },
      queryOptions: {
        onSettled: invalidateFeatureQueries,
        ...queryOptions,
      },
    });

    return returnBodyMutation(mutation);
  }

  function usePut<TResponse = void>(
    queryOptions?: MutationOpts<TResponse, TEntity>,
  ): MutationRes<TResponse, TEntity> {
    const mutation = useAxiosMutation({
      config: {
        url: featureUrl,
        method: HttpMethods.Put,
      },
      queryOptions: {
        onSettled: invalidateFeatureQueries,
        ...queryOptions,
      },
    });

    return returnBodyMutation(mutation);
  }

  function usePutId<TResponse = void>(
    queryOptions?: MutationOpts<TResponse, { id: number; body: PostEntity }>,
  ): MutationRes<TResponse, { id: number; body: PostEntity }> {
    const mutation = useAxiosMutation({
      config: {
        url: featureUrl,
        method: HttpMethods.Put,
      },
      queryOptions: {
        onSettled: invalidateFeatureQueries,
        ...queryOptions,
      },
    });

    return returnIdBodyMutation(mutation);
  }

  function useRemove<TResponse = void>(
    queryOptions?: MutationOpts<TResponse, number>,
  ): MutationRes<TResponse, number> {
    const mutation = useAxiosMutation({
      config: {
        url: featureUrl,
        method: HttpMethods.Delete,
      },
      queryOptions: {
        onSettled: invalidateFeatureQueries,
        ...queryOptions,
      },
    });

    return returnIdMutation(mutation);
  }

  function invalidateFeatureQueries(): Promise<void> {
    return client.invalidateQueries(baseQueryKey);
  }

  function returnIdMutation<TResponse>(mutation: MutationRes<unknown, AxiosRequestConfig>) {
    return {
      ...mutation,
      ...transformMutateFns.id(mutation, featureUrl),
    } as MutationRes<TResponse, number>;
  }

  function returnBodyMutation<TResponse, TVariables>(
    mutation: MutationRes<unknown, AxiosRequestConfig>,
  ) {
    return {
      ...mutation,
      ...transformMutateFns.body(mutation, featureUrl),
    } as MutationRes<TResponse, TVariables>;
  }

  function returnIdBodyMutation<TResponse>(mutation: MutationRes<unknown, AxiosRequestConfig>) {
    return {
      ...mutation,
      ...transformMutateFns.idBody(mutation, featureUrl),
    } as unknown as MutationRes<TResponse, { id: number; body: PostEntity }>;
  }

  return {
    useGet,
    useOData,
    useApiMutation,
    usePost,
    usePut,
    usePutId,
    useRemove,
  };
}
