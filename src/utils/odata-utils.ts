import { ODataOperators, ParenthesesOperators } from '../types/odata-operators.enum';

function normalizeValue(value: string | number): string {
  return typeof value === 'number' ? value.toString() : `'${value}'`;
}

function buildFilter(prop: string, op: ODataOperators, value: string | number): string {
  return `${prop} ${op} ${normalizeValue(value)}`;
}

const buildParenthesesFilter = (
  prop: string,
  op: ParenthesesOperators,
  value: string | number,
): string => `${op}(${prop}, ${normalizeValue(value)})`;

const buildEqId = (id?: string | number): string => buildFilter('id', ODataOperators.Equals, +id!);

function buildContains(prop: string, value: string): string {
  return buildParenthesesFilter(prop, ParenthesesOperators.Contains, value);
}

export { buildFilter, buildParenthesesFilter, buildEqId, buildContains };
