import { useApi } from '../../../hooks/use-api';
import { CardModel } from '../types';

const url = '/cards';

export const useCardApi = () => useApi<CardModel>(url);
