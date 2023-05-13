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

    return returnBodyMutation(mutation);
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

    return returnBodyMutation(mutation);
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

    return returnIdBodyMutation(mutation);
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

    return returnIdMutation(mutation);
  }

  function invalidateFeatureQueries(): Promise<void> {
    return client.invalidateQueries(baseQueryKey);
  }

  function returnIdMutation(mutation: MutationRes<unknown, AxiosRequestConfig<any>>) {
    return {
      ...mutation,
      ...transformMutateFns.id(mutation, featureUrl),
    } as any;
  }

  function returnBodyMutation(mutation: MutationRes<unknown, AxiosRequestConfig<any>>) {
    return {
      ...mutation,
      ...transformMutateFns.body(mutation, featureUrl),
    } as any;
  }

  function returnIdBodyMutation(mutation: MutationRes<unknown, AxiosRequestConfig<any>>) {
    return {
      ...mutation,
      ...transformMutateFns.idBody(mutation, featureUrl),
    } as any;
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
