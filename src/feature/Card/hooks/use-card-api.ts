import { useAxios } from '../../../hooks';
import { useAxiosMutation } from '../../../hooks/use-axios';
import { HttpMethods, ODataParams, PostReturn } from '../../../types';
import { CardModel } from '../types';

const url = '/cards';
const photosUrl = '/photos';

// TODO make this generic?
const useCardApi = () => {
  return {
    useOData,
    usePost,
    usePut,
    useDelete,
    usePostPhoto,
  };
};

const useOData = <TReturn>(odataParams: ODataParams) => {
  return useAxios<TReturn>({
    method: HttpMethods.Get,
    url: `${url}/odata`,
    params: odataParams,
  });
};

const usePost = (entity: CardModel) => {
  return useAxiosMutation<PostReturn>({
    method: HttpMethods.Post,
    url,
    data: entity,
  });
};

const usePut = (id: number, entity: CardModel) => {
  if (typeof id !== 'number') throw Error('Invalid id argument!');

  return useAxiosMutation<void>({
    method: HttpMethods.Put,
    url: `${url}/${id}`,
    data: entity,
  });
};

const useDelete = (id?: number) => {
  return useAxiosMutation<void>({
    method: HttpMethods.Delete,
    url: `${url}/${id}`,
  });
};

const usePostPhoto = (file?: File) => {
  const formData = new FormData();

  if (file != null) formData.append('photo', file);

  return useAxiosMutation<PostReturn>({
    method: HttpMethods.Post,
    url: photosUrl,
    data: formData,
  });
};

export { useCardApi };
