import { useQuery } from '@tanstack/react-query';
import { SearchRequestParams, getItemList } from '../utils/http';

export const useGetItemList = (
  params: SearchRequestParams,
  page = 0,
  pageSize = 10,
) => {
  return useQuery({
    queryKey: ['SEARCH_ITEM_LIST', page, pageSize, params],
    queryFn: () => getItemList(params),
    staleTime: 50000,
    gcTime: 60000,
  });
};
