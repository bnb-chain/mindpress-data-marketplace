import { useQuery } from '@tanstack/react-query';
import { getItemByGroupId } from '../../utils/apis';

export const useGetItemByGroupId = (groupId: string) => {
  return useQuery({
    enabled: !!groupId,
    queryKey: ['GET_ITEM_BY_GROUP_ID', groupId],
    queryFn: async () => {
      return await getItemByGroupId(groupId);
    },
    staleTime: 10000,
  });
};
