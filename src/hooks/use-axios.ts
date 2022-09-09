import { EnvKeys } from './../types/env-keys.enum';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import { getEnvValue } from '../utils';

axios.defaults.baseURL = getEnvValue(EnvKeys.ApiUrl);

const useAxios = <T>(config: AxiosRequestConfig) =>
  useQuery<AxiosResponse<T>, AxiosError<T>>(
    [config.url, config.params].filter((x) => !!x),
    () => axios.request<T>(config)
  );

export default useAxios;
