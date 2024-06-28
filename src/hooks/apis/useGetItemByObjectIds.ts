import { useQuery } from '@tanstack/react-query';
import { getItemByObjectIds } from '../../utils/apis';

export const useGetItemByObjectIds = ({ ids }: { ids?: number[] }) => {
  return useQuery({
    enabled: !!ids && ids.length > 0,
    queryKey: ['GET_ITEM_BY_OBJECT_IDS', ids],
    queryFn: async () => {
      if (!ids) return;
      return await getItemByObjectIds(ids);
    },
    staleTime: 10_000,
  });
};
