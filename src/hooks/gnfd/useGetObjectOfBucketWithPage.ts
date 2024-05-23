import { useQuery } from '@tanstack/react-query';
import { client } from '../../utils/gfSDK';
import { THUMB } from '../../utils/space';
import { useGetBucketEndpoint } from './useGetBucketEndpoint';

export const useGetObjectOfBucketWithPage = (
  bucketName: string,
  pageSize: number,
  token: string,
) => {
  const { data: endpoint, isLoading: isLoadingGetEndpoint } =
    useGetBucketEndpoint(bucketName);

  return useQuery({
    // enabled: !isLoadingGetEndpoint && !!endpoint,
    enabled: false,
    queryKey: ['GET_OBJECT_OF_BUCKET', bucketName, token],
    queryFn: async () => {
      if (!endpoint) return;

      const listObjs = await client.object.listObjects({
        bucketName,
        endpoint,
        query: new URLSearchParams({
          delimiter: '/',
          prefix: `${THUMB}/`,
          'max-keys': String(pageSize),
          'continuation-token': token,
        }),
      });

      return listObjs;
    },
    staleTime: 20_000,
  });
};
