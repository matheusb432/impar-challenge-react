import { AxiosError } from 'axios';
import { useAxios } from '../../../hooks';
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
    url: `${url}/odata`,
    params: { $count: true, $skip: 0, $top: 20 },
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

const useDelete = (id: number) => {
  if (typeof id !== 'number') throw Error('Invalid id argument!');

  return useAxios<CardModel>({
    method: HttpMethods.Delete,
    url: `${url}/${id}`,
  });
};

export { useCardApi };
