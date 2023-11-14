import { useQuery } from '@tanstack/react-query';
import { getObjectInfo } from '../utils/gfSDK';

export const useGfGetObjInfo = (objectId: string) => {
  return useQuery({
    enabled: !!objectId,
    queryKey: ['GF_GET_OBJECT_INFO', objectId],
    queryFn: async () => {
      return await getObjectInfo(objectId);
    },
    gcTime: 20000,
    staleTime: 10000,
  });
};
