// import { useAxios } from '../../../hooks';
import { useApi } from '../../../hooks/use-api';
import { MutationOpts } from '../../../hooks/use-axios';
import { PostReturn } from '../../../types';
// import { useAxiosMutation } from '../../../hooks/use-axios';
// import { HttpMethods, ODataParams, PostReturn } from '../../../types';
import { CardModel } from '../types';

const url = '/cards';
const photosUrl = '/photos';

/**
 * Hook contendo todas as possíveis requisições para endpoints da API relacionadas
 * ao domínio de Cards.
 *
 * @returns Objeto com referências às funções de requisições.
 */
// const useCardApi = () => ({
//   useOData,
//   useODataMutation,
//   usePost,
//   usePut,
//   useDelete,
//   usePostPhoto,
//   usePutPhoto,
// });
const useCardApi = () => {
  const cardApi = useApi<CardModel>(url);
  const photoApi = useApi<FormData>(photosUrl);

  const postPhoto = (file?: File, queryOptions?: MutationOpts<PostReturn>) => {
    const formData = createPhotoFormData(file);

    return photoApi.post(formData, queryOptions);
  };

  const putPhoto = (id?: number, file?: File, queryOptions?: MutationOpts<void>) => {
    const formData = createPhotoFormData(file);

    if (id == null) return photoApi.put(formData);
    return photoApi.putId(id, formData, queryOptions);
  };

  function createPhotoFormData(file?: File): FormData {
    const formData = new FormData();

    if (file != null) formData.append('photo', file);
    return formData;
  }

  return {
    ...cardApi,
    postPhoto,
    putPhoto,
  };
  // useOData,
  // useODataMutation,
  // usePost,
  // usePut,
  // useDelete,
  // usePostPhoto,
  // usePutPhoto,
};

// const useOData = <TReturn>(odataParams: ODataParams) =>
//   useAxios<TReturn>({
//     method: HttpMethods.Get,
//     url: `${url}/odata`,
//     params: odataParams,
//   });

// const useODataMutation = <TReturn>(odataParams: ODataParams) =>
//   useAxiosMutation<TReturn>({
//     method: HttpMethods.Get,
//     url: `${url}/odata`,
//     params: odataParams,
//   });

// const usePost = (entity: CardModel) =>
//   useAxiosMutation({
//     method: HttpMethods.Post,
//     url,
//     data: entity,
//   });

// const usePut = (id?: number, entity?: CardModel) =>
//   useAxiosMutation<void>({
//     method: HttpMethods.Put,
//     url: `${url}/${id}`,
//     data: entity,
//   });

// const useDelete = (id?: number) =>
//   useAxiosMutation<void>({
//     method: HttpMethods.Delete,
//     url: `${url}/${id}`,
//   });

// const usePostPhoto = (file?: File) => {
//   const formData = new FormData();

//   if (file != null) formData.append('photo', file);

//   return useAxiosMutation<PostReturn>({
//     method: HttpMethods.Post,
//     url: photosUrl,
//     data: formData,
//   });
// };

// const usePutPhoto = (id?: number, file?: File) => {
//   const formData = new FormData();

//   if (file != null) formData.append('photo', file);

//   return useAxiosMutation<void>({
//     method: HttpMethods.Put,
//     url: `${photosUrl}/${id}`,
//     data: formData,
//   });
// };

export { useCardApi };
