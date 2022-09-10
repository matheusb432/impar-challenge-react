import { AxiosError } from 'axios';
import { useAxios } from '../../../hooks';
import { useAxiosMutation } from '../../../hooks/use-axios';
import { HttpMethods, ODataParams } from '../../../types';
import { CardModel } from '../types';

const url = '/cards';

// TODO make this generic?
const useCardApi = () => {
  return {
    useOData,
    usePost,
    usePut,
    useDelete,
  };
};

const useOData = <TReturn>(odataParams: ODataParams) => {
  return useAxios<TReturn>({
    method: HttpMethods.Get,
    url: `${url}/odatsdasa`,
    params: odataParams,
  });
};

const usePost = (entity: CardModel) => {
  return useAxios<CardModel>({
    method: HttpMethods.Put,
    url,
    data: entity,
  });
};

const usePut = (id: number, entity: CardModel) => {
  if (typeof id !== 'number') throw Error('Invalid id argument!');

  return useAxios<CardModel>({
    method: HttpMethods.Put,
    url: `${url}/${id}`,
    data: entity,
  });
};

const useDelete = (id?: number) => {
  return useAxiosMutation<CardModel>({
    method: HttpMethods.Delete,
    url: `${url}/${id}`,
  });
};

export { useCardApi };
