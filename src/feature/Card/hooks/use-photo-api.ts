import { useApi } from '../../../hooks/use-api';
import { PostReturn } from '../../../types';
import { MutationOpts } from '../../../types/query-types';

const url = '/photos';

export const usePhotoApi = () => {
  const { usePost, usePutId } = useApi<FormData>(url);

  function usePhotoPost(queryOptions?: MutationOpts<PostReturn, FormData>) {
    // const formData = (file);
    return usePost(queryOptions);
  }

  function usePhotoPut(queryOptions?: MutationOpts<void, FormData>) {
    // const formData = createPhotoFormData(file);

    // if (id == null) return usePut(formData);
    return usePutId(queryOptions);
  }

  return {
    usePost: usePhotoPost,
    usePut: usePhotoPut,
  };
};
