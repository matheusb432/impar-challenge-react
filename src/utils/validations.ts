import { ValidationData } from './validation-data';

const validateText = (text?: string, data?: ValidationData) => {
  const { required = true, min, max } = data || {};

  if (!text?.trim() || text == null) return !required;

  const len = text.length;

  return !!text.trim() && (!min || len >= min) && (!max || len <= max);
};

const validateId = (id: any) => id != null && typeof +id === 'number';

const validateImage = (file?: File): boolean =>
  !!file && file['type'].split('/')[0] === 'image';

export { validateText, validateId, validateImage };
