import { ODataParams } from './odata-params';

export const defaultItemsPerPage = 5;

const paginationQuery = (
  page = 1,
  items = defaultItemsPerPage
): ODataParams => {
  return { $count: true, $skip: (page - 1) * items, $top: items };
};

export { paginationQuery };
