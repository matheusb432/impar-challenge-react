import {
  ODataOperators,
  ParenthesesOperators,
} from '../types/odata-operators.enum';

const buildFilter = (
  prop: string,
  op: ODataOperators,
  value: string | number
): string => {
  value = normalizeValue(value);

  return `${prop} ${op} ${value}`;
};

const buildParenthesesFilter = (
  prop: string,
  op: ParenthesesOperators,
  value: string | number
): string => {
  value = normalizeValue(value);

  return `${op}(${prop}, ${value})`;
};

const normalizeValue = (value: string | number): string => {
  return typeof value === 'number' ? value.toString() : `'${value}'`;
};

const buildEqId = (id?: string | number): string =>
  buildFilter('id', ODataOperators.Equals, +id!);

const buildContains = (prop: string, value: string): string =>
  buildParenthesesFilter(prop, ParenthesesOperators.Contains, value);

export { buildFilter, buildParenthesesFilter, buildEqId, buildContains };
