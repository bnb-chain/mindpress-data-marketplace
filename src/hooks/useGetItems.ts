import { useQuery } from '@tanstack/react-query';
import { getItems } from '../utils/http';

export const useGetItems = (ids: number[]) => {
  return useQuery({
    queryKey: ['GET_ITEMS_BY_IDS', ids],
    queryFn: () => getItems(ids),
    gcTime: Infinity,
    staleTime: Infinity,
  });
};
