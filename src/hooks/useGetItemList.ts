import { useQuery } from '@tanstack/react-query';
import { searchItems } from '../utils/apis';
import { SearchItemsRequest } from '../utils/apis/types';

export const useGetItemList = (
  params: SearchItemsRequest,
  page = 0,
  pageSize = 10,
) => {
  return useQuery({
    queryKey: ['SEARCH_ITEM_LIST', page, pageSize, params],
    queryFn: () => searchItems(params),
    staleTime: 10000,
    gcTime: 20000,
  });
};
