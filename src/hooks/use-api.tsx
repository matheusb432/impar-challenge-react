import { useQueryClient } from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';
import { HttpMethods, ODataParams, PostReturn } from '../types';
import { buildUniqueKeyFromUrl, useAxios, useAxiosMutation } from './use-axios';
import { transformMutateFns } from '../utils';
import { MutationOpts, MutationRes, QueryOpts, QueryRes } from '../types/query-types';

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

    return returnMutation(mutation, 'body');
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

    return returnMutation(mutation, 'body');
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

    return returnMutation(mutation, 'id-body');
  }

  function useRemove<TResponse = void, TVariables = number>(
    queryOptions?: MutationOpts<TResponse, TVariables>,
  ): MutationRes<TResponse, TVariables> {
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

    return returnMutation(mutation, 'id');
  }

  function invalidateFeatureQueries(): Promise<void> {
    return client.invalidateQueries(baseQueryKey);
  }

  function returnMutation(
    mutation: MutationRes<unknown, AxiosRequestConfig<any>>,
    varTypes: 'id' | 'body' | 'id-body',
  ) {
    return {
      ...mutation,
      ...transformMutateFns(mutation, featureUrl, varTypes),
    };
  }

  return {
    useGet,
    useOData,
    usePost,
    usePut,
    usePutId,
    useRemove,
  };
}
