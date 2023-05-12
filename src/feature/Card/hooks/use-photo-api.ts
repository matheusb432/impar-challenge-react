import { useApi } from '../../../hooks/use-api';
import { MutationOpts } from '../../../hooks/use-axios';
import { PostReturn } from '../../../types';

const url = '/photos';

export const usePhotoApi = () => {
  const { usePost, usePut, usePutId } = useApi<FormData>(url);

  const usePhotoPost = (file?: File, queryOptions?: MutationOpts<PostReturn>) => {
    const formData = createPhotoFormData(file);

    return usePost(formData, queryOptions);
  };

  const usePhotoPut = (id?: number, file?: File, queryOptions?: MutationOpts<void>) => {
    const formData = createPhotoFormData(file);

    if (id == null) return usePut(formData);
    return usePutId(id, formData, queryOptions);
  };

  function createPhotoFormData(file?: File): FormData {
    const formData = new FormData();

    if (file != null) formData.append('photo', file);
    return formData;
  }

  return {
    usePost: usePhotoPost,
    usePut: usePhotoPut,
  };
};
