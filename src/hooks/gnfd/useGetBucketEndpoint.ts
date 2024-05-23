import { useQuery } from '@tanstack/react-query';
import { client } from '../../utils/gfSDK';

export const useGetBucketEndpoint = (bucketName: string) => {
  return useQuery({
    queryKey: ['GET_BUCKET_ENDPOINT', bucketName],
    queryFn: async () => {
      const endpoint = await client.sp.getSPUrlByBucket(bucketName);

      return endpoint;
    },
    staleTime: Infinity,
  });
};
