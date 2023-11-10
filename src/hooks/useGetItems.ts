import { useQuery } from '@tanstack/react-query';
import { getItemsById } from '../utils/apis';

export const useGetItems = (ids: number[]) => {
  return useQuery({
    queryKey: ['GET_ITEMS_BY_IDS', ids],
    queryFn: () => getItemsById(ids),
    gcTime: 10000,
    staleTime: 30000,
  });
};
