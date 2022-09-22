import { SharedErrorKeys } from '../types/shared-error-keys.enum';
import { EnvKeys } from '../types';

async function sleep(ms: number): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const sortArrayByProp = <T>(arr: T[], prop: keyof T): void => {
  arr.sort((a, b) => (a[prop] > b[prop] ? 1 : -1));
};

function base64Format(base64: string, extension = 'png') {
  if (base64.startsWith('data:image/') && base64.includes(';base64,')) return base64;

  return `data:image/${extension};base64,${base64}`;
}

function onEnterPress<T>(event: React.KeyboardEvent<T>, callback?: () => void) {
  return event.key === 'Enter' ? callback?.() : null;
}

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

function toBase64(file: File): Promise<string | unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

function arrayFrom(items: number, increment = 0) {
  return Array.from(Array(items).keys()).map((i) => i + increment);
}

export {
  sleep,
  sortArrayByProp,
  base64Format,
  onEnterPress,
  getEnvValue,
  errorCodeToKey,
  deepClone,
  toBase64,
  arrayFrom,
};
