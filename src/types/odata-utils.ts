import { ODataParams } from './odata-params';

const paginationQuery = (page = 1, items = 20): ODataParams => {
  return { $count: true, $skip: (page - 1) * items, $top: items };
};

export { paginationQuery };
