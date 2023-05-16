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

function transformMutateFnsIdBody<TEntity, TResponse = void>(
  mutation: MutationRes<TResponse>,
  featureUrl: string,
) {
  return {
    mutate: (data: { id: number; body: Omit<TEntity, 'id'> }) =>
      mutation.mutate(createMutationConfig(featureUrl, data.id, data.body)) as unknown as TResponse,
    mutateAsync: (data: { id: number; body: Omit<TEntity, 'id'> }) =>
      mutation.mutateAsync(
        createMutationConfig(featureUrl, data.id, data.body),
      ) as Promise<TResponse>,
  };
}

function transformMutateFnsId<TResponse = void>(
  mutation: MutationRes<TResponse>,
  featureUrl: string,
): { mutate: (id: number) => TResponse; mutateAsync: (id: number) => Promise<TResponse> } {
  return {
    mutate: (id: number) =>
      mutation.mutate(createMutationConfig(featureUrl, id)) as unknown as TResponse,
    mutateAsync: (id: number) =>
      mutation.mutateAsync(createMutationConfig(featureUrl, id)) as Promise<TResponse>,
  };
}

function transformMutateFnsBody<TEntity, TResponse = void>(
  mutation: MutationRes<TResponse>,
  featureUrl: string,
) {
  return {
    mutate: (body: TEntity) =>
      mutation.mutate(createMutationConfig(featureUrl, undefined, body)) as unknown as TResponse,
    mutateAsync: (body: TEntity) =>
      mutation.mutateAsync(createMutationConfig(featureUrl, undefined, body)) as Promise<TResponse>,
  };
}

export const transformMutateFns = {
  id: transformMutateFnsId,
  body: transformMutateFnsBody,
  idBody: transformMutateFnsIdBody,
};
