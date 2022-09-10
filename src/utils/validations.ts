const validateText = (text?: string, min?: number, max?: number) => {
  if (text == null) return false;

  const len = text.length;

  return !!text.trim() && (!min || len >= min) && (!max || len <= max);
};

const validateId = (id: any) => id != null && typeof +id === 'number';

export { validateText, validateId };
