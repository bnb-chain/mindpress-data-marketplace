import { useQuery } from '@tanstack/react-query';
import { getItemByObjectId } from '../../utils/apis';
import { DEFAULT_ITEM } from './useGetItemById';

export const useGetItemByObjId = (objectId: string) => {
  return useQuery({
    enabled: !!objectId,
    queryKey: ['GET_ITEM_BY_OBJECT_ID', objectId],
    queryFn: async () => {
      const res = await getItemByObjectId(objectId);
      return res;
    },
    // gcTime: Infinity,
    // staleTime: Infinity,
    initialData: DEFAULT_ITEM,
  });
};
