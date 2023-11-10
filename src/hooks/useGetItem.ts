import { useQuery } from '@tanstack/react-query';
import { getItem } from '../utils/apis';

export const useGetItem = (id: number) => {
  return useQuery({
    queryKey: ['GET_ITEM', id],
    queryFn: () => getItem(id),
    gcTime: 20000,
    staleTime: 10000,
  });
};
