import { useQueryClient } from '@tanstack/react-query';
import { HttpMethods, ODataParams, PostReturn } from '../types';
import { buildUniqueKeyFromUrl, useAxios, useAxiosMutation } from './use-axios';
import { transformMutateFns } from '../utils';
import { MutationOpts, MutationRes, QueryOpts } from '../types/query-types';

/**
 * Hook criador de todas as possíveis requisições para endpoints da API
 *
 * @returns Objeto com referências às funções de requisições.
 */

export function useApi<TEntity extends { id?: number }>(featureUrl: string) {
  const client = useQueryClient();
  const baseQueryKey = buildUniqueKeyFromUrl(featureUrl);

  type PostEntity = Omit<TEntity, 'id'>;

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
    mutationOptions?: MutationOpts<TResponse, void>,
  ) {
    return useAxiosMutation({
      config: {
        url: `${featureUrl}/odata`,
        params,
      },
      queryOptions: mutationOptions,
    });
  }

  function useGet(
    urlSuffix = '',
    params: Record<string, unknown> = {},
    queryOptions?: QueryOpts<TEntity>,
  ) {
    return useAxios<TEntity>({
      config: {
        url: `${featureUrl}${urlSuffix}`,
        method: HttpMethods.Get,
        params,
      },
      queryOptions,
    });
  }

  function usePost<TResponse = PostReturn, TVariables = PostEntity>(
    queryOptions?: MutationOpts<TResponse, TVariables>,
  ): MutationRes<TResponse, TVariables> {
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

    return {
      ...mutation,
      ...transformMutateFns(mutation, featureUrl, 'body'),
    };
  }

  function usePut<TResponse = void, TVariables = TEntity>(
    queryOptions?: MutationOpts<TResponse, TVariables>,
  ): MutationRes<TResponse, TVariables> {
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

    return { ...mutation, ...transformMutateFns(mutation, featureUrl, 'body') };
  }

  function usePutId<TResponse = void, TVariables = PostEntity>(
    queryOptions?: MutationOpts<TResponse, TVariables>,
  ): MutationRes<TResponse, { id: number; body: TVariables }> {
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

    return { ...mutation, ...transformMutateFns(mutation, featureUrl, 'id-body') };
  }

  // TODO useApiMutation<TR, TV>?
  function useRemove<TResponse = void, TVariables = number>(
    queryOptions?: MutationOpts<TResponse, TVariables>,
  ): MutationRes<TResponse, TVariables> {
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

    return {
      ...mutation,
      // TODO implement currying?
      ...transformMutateFns(mutation, featureUrl, 'id'),
    };
  }

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
