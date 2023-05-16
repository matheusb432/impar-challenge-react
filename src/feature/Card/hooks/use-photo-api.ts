import { useApi } from '../../../hooks/use-api';
import { PostReturn } from '../../../types';
import { MutationOpts } from '../../../types/query-types';

const url = '/photos';

export const usePhotoApi = () => {
  const { usePost, usePutId } = useApi<FormData>(url);

  function usePhotoPost(queryOptions?: MutationOpts<PostReturn, FormData>) {
    return usePost(queryOptions);
  }

  function usePhotoPut(queryOptions?: MutationOpts<void, { id: number; body: FormData }>) {
    return usePutId(queryOptions);
  }

  return {
    usePost: usePhotoPost,
    usePut: usePhotoPut,
  };
};
