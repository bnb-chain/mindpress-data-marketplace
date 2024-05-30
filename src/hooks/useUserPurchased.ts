import { useQuery } from '@tanstack/react-query';
import { searchPurchase } from '../utils/apis';

export const useGetUserPurchasedList = (
  address: string,
  page: number,
  pageSize: number,
) => {
  return useQuery({
    enabled: !!address,
    queryKey: ['PURCHASE_LIST', address, page, pageSize],
    staleTime: 60_000,
    queryFn: async () => {
      return await searchPurchase({
        filter: {
          address,
        },
        offset: page * pageSize,
        limit: pageSize,
        sort: 'CREATION_DESC',
      });
    },
  });
};
