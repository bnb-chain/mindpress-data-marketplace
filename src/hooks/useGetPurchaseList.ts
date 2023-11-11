import { useQuery } from '@tanstack/react-query';
import { SearchPurchaseRequest } from '../utils/apis/types';
import { searchPurchase } from '../utils/apis';

export const useGetPurchaseList = (
  params: SearchPurchaseRequest,
  page = 0,
  pageSize = 10,
) => {
  return useQuery({
    queryKey: ['SEARCH_PURCHASE', page, pageSize, params],
    queryFn: () => searchPurchase(params),
    staleTime: 10000,
    gcTime: 20000,
  });
};
