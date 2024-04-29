import { useQuery } from '@tanstack/react-query';
import { getAllSps } from '../utils/off-chain-auth/utils';

export const useSelectEndpoint = () => {
  return useQuery({
    queryKey: ['select-sp'],
    queryFn: async () => {
      const sps = await getAllSps();

      return sps[0].endpoint;
    },
    staleTime: Infinity,
  });
};
