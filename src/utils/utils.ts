import { SharedErrorKeys } from './../types/shared-error-keys.enum';
import { EnvKeys } from '../types';

const sleep = async (ms: number): Promise<any> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const sortArrayByProp = <T>(arr: T[], prop: keyof T): void => {
  arr.sort((a, b) => (a[prop] > b[prop] ? 1 : -1));
};

const base64Format = (base64: string) =>
  base64.startsWith('data:image/png;base64')
    ? base64
    : `data:image/png;base64,${base64}`;

const onEnterPress = <T>(
  event: React.KeyboardEvent<T>,
  callback?: () => void
) => (event.key === 'Enter' ? callback?.() : null);

const getEnvValue = (key: EnvKeys) => process.env[key];

const errorCodeToKey = (code?: string) => {
  switch (code) {
    case 'ERR_NETWORK':
      return SharedErrorKeys.NetworkError;
    case 'ERR_BAD_REQUEST':
      return SharedErrorKeys.BadRequest;
    default:
      return SharedErrorKeys.Default;
  }
};

const deepClone = (value: any) => structuredClone(value);

const toBase64 = (file: File): Promise<string | unknown> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export {
  sleep,
  sortArrayByProp,
  base64Format,
  onEnterPress,
  getEnvValue,
  errorCodeToKey,
  deepClone,
  toBase64,
};
