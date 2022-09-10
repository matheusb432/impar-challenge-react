import { ODataOperators } from '../types/odata-operators.enum';

const buildFilter = (
  prop: string,
  op: ODataOperators,
  value: string | number
) => {
  value = typeof value === 'number' ? value.toString() : `'${value}'`;

  return `${prop} ${op} ${value}`;
};

const buildEqId = (id?: string | number) =>
  buildFilter('id', ODataOperators.Equals, +id!);

export { buildFilter, buildEqId };
