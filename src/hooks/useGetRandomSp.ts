import { useQuery } from '@tanstack/react-query';
import { getRandomSp } from '../utils/gfSDK';

export const useGetRandomSp = () => {
  return useQuery({
    queryKey: ['GET_RANDOM_SP'],
    queryFn: async () => {
      const endpoint = await getRandomSp();

      return endpoint;
    },
    staleTime: Infinity,
  });
};
