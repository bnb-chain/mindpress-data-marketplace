import { useQuery } from '@tanstack/react-query';
import { getCategoryMap } from '../utils/apis';

export const useGetCatoriesMap = () => {
  return useQuery({
    queryKey: ['getCatoriesMap'],
    queryFn: getCategoryMap,
    gcTime: Infinity,
    staleTime: Infinity,
  });
};
