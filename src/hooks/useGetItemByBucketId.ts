import { useQuery } from '@tanstack/react-query';
import { getItemByBucketId } from '../utils/apis';

export const useGetItemByBucketId = (bucketId: string) => {
  return useQuery({
    enabled: !!bucketId,
    queryKey: ['GET_ITEM_BY_BUCKET_ID', bucketId],
    queryFn: async () => {
      return await getItemByBucketId(bucketId);
    },
    gcTime: Infinity,
    staleTime: Infinity,
  });
};
