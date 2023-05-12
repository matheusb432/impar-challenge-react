import { AxiosRequestConfig } from 'axios';
import { MutationRes } from '../types/query-types';

function createMutationConfig<TEntity>(
  featureUrl: string,
  id?: number,
  body?: TEntity,
): Record<string, string | TEntity> {
  const config: Record<string, TEntity | string> = {};
  if (id !== undefined) {
    config.url = `${featureUrl}/${id}`;
  }
  if (body !== undefined) {
    config.data = body;
  }
  return config;
}

// TODO refactor to separate fns
export function transformMutateFns<TEntity, TResponse = void, TVariables = TEntity>(
  //   mutation: UseMutationResult<TResponse>,
  mutation: MutationRes<TResponse, AxiosRequestConfig<TVariables>>,
  featureUrl: string,
  modes: 'id' | 'body' | 'id-body',
  // TODO improve typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  if (modes === 'id-body') {
    return {
      mutate: (id: number, body: Omit<TEntity, 'id'>) =>
        mutation.mutate(createMutationConfig(featureUrl, id, body)) as unknown as TResponse,
      mutateAsync: (id: number, body: Omit<TEntity, 'id'>) =>
        mutation.mutateAsync(createMutationConfig(featureUrl, id, body)) as Promise<TResponse>,
    };
  }
  if (modes === 'id') {
    return {
      mutate: (id: number) =>
        mutation.mutate(createMutationConfig(featureUrl, id)) as unknown as TResponse,
      mutateAsync: (id: number) =>
        mutation.mutateAsync(createMutationConfig(featureUrl, id)) as Promise<TResponse>,
    };
  }
  if (modes === 'body') {
    return {
      mutate: (body: TEntity) =>
        mutation.mutate(createMutationConfig(featureUrl, undefined, body)) as unknown as TResponse,
      mutateAsync: (body: TEntity) =>
        mutation.mutateAsync(
          createMutationConfig(featureUrl, undefined, body),
        ) as Promise<TResponse>,
    };
  }

  return {
    mutate: () => mutation.mutate(createMutationConfig(featureUrl)) as unknown as TResponse,
    mutateAsync: () => mutation.mutateAsync(createMutationConfig(featureUrl)) as Promise<TResponse>,
  };
}
