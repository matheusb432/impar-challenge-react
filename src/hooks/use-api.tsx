import { useQueryClient } from '@tanstack/react-query';
import { HttpMethods, ODataParams, PostReturn } from '../types';
import {
  MutationOpts,
  QueryOpts,
  buildUniqueKeyFromUrl,
  useAxios,
  useAxiosMutation,
} from './use-axios';

/**
 * Hook criador de todas as possíveis requisições para endpoints da API
 *
 * @returns Objeto com referências às funções de requisições.
 */
export function useApi<TEntity>(featureUrl: string) {
  const client = useQueryClient();
  const baseQueryKey = buildUniqueKeyFromUrl(featureUrl);

  function useOData<TResponse = TEntity[]>(
    params: ODataParams,
    queryOptions?: QueryOpts<TResponse>,
  ) {
    return useAxios<TResponse>({
      config: {
        url: `${featureUrl}/odata`,
        params,
      },
      queryOptions,
    });
  }

  // TODO refactor to remove?
  function useODataMutation<TResponse = TEntity[]>(
    params: ODataParams,
    mutationOptions?: MutationOpts<TResponse>,
  ) {
    return useAxiosMutation<TResponse>({
      config: {
        url: `${featureUrl}/odata`,
        params,
      },
      queryOptions: mutationOptions,
    });
  }

  const useGet = (
    urlSuffix = '',
    params: Record<string, unknown> = {},
    queryOptions?: QueryOpts<TEntity>,
  ) =>
    useAxios<TEntity>({
      config: {
        url: `${featureUrl}${urlSuffix}`,
        method: HttpMethods.Get,
        params,
      },
      queryOptions,
    });

  const usePost = (body: TEntity, queryOptions?: MutationOpts<PostReturn>) =>
    useAxiosMutation<PostReturn, TEntity>({
      config: {
        url: featureUrl,
        method: HttpMethods.Post,
        data: body,
      },
      queryOptions: {
        onSettled: invalidateFeatureQueries,
        ...queryOptions,
      },
    });

  const usePut = (body: TEntity, queryOptions?: MutationOpts<void>) =>
    useAxiosMutation<void, TEntity>({
      config: {
        url: featureUrl,
        method: HttpMethods.Put,
        data: body,
      },
      queryOptions: {
        onSettled: invalidateFeatureQueries,
        ...queryOptions,
      },
    });

  const usePutId = (id: number, body: TEntity, queryOptions?: MutationOpts<void>) =>
    useAxiosMutation<void, TEntity>({
      config: {
        url: `${featureUrl}/${id}`,
        method: HttpMethods.Put,
        data: body,
      },
      queryOptions: {
        onSettled: invalidateFeatureQueries,
        ...queryOptions,
      },
    });

  const useRemove = (id: number, queryOptions?: MutationOpts<void>) =>
    useAxiosMutation<void, void>({
      config: {
        url: `${featureUrl}/${id}`,
        method: HttpMethods.Delete,
      },
      queryOptions: {
        onSettled: invalidateFeatureQueries,
        ...queryOptions,
      },
    });

  function invalidateFeatureQueries(): Promise<void> {
    return client.invalidateQueries(baseQueryKey);
  }

  return {
    useOData,
    useODataMutation,
    useGet,
    usePost,
    usePut,
    usePutId,
    useRemove,
  };
}
