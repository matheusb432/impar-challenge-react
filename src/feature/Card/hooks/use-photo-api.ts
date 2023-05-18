import { useApi } from '../../../hooks/use-api';

const url = '/photos';

export const usePhotoApi = () => {
  const { usePost, usePut } = useApi<FormData>(url);

  return {
    usePost,
    usePut,
  };
};
