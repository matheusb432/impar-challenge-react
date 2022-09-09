import { EnvKeys } from '../types';

const sleep = async (ms: number): Promise<any> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const sortArrayByProp = <T>(arr: T[], prop: keyof T): void => {
  arr.sort((a, b) => (a[prop] > b[prop] ? 1 : -1));
};

const onEnterPress = <T>(
  event: React.KeyboardEvent<T>,
  callback?: () => void
) => (event.key === 'Enter' ? callback?.() : null);

const getEnvValue = (key: EnvKeys) => process.env[key];

export { sleep, sortArrayByProp, onEnterPress, getEnvValue };
