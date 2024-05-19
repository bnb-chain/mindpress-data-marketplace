import { useQuery } from '@tanstack/react-query';
import { client } from '../utils/gfSDK';
import { getItemByObjectIds } from '../utils/apis';

const PAGE_SIZE = 20;
export const useGetObjInBucketListStatus = (
  bucketName: string,
  page: number,
) => {
  return useQuery({
    queryKey: ['GET_OBJ_IN_BUCKET_LIST_STATUS', bucketName, page],
    queryFn: async () => {
      const endpoint = await client.sp.getSPUrlByBucket(bucketName);

      const listObjs = await client.object.listObjects({
        bucketName,
        endpoint,
        query: new URLSearchParams({
          delimiter: '/',
          'start-after': String(page),
          prefix: '/',
          'max-keys': String(PAGE_SIZE),
        }),
      });

      console.log('listObjs', listObjs);

      // console.log('listObjs', listObjs);
      if (!listObjs.body) {
        return {
          objsData: [],
          listIndex: [],
        };
      }

      const ids = listObjs.body.GfSpListObjectsByBucketNameResponse.Objects.map(
        (item) => item.ObjectInfo.Id,
      );

      // had listed object list
      const listedObjList = await getItemByObjectIds(ids);
      console.log('res', listedObjList);

      return {
        objsData: listObjs.body.GfSpListObjectsByBucketNameResponse.Objects,
        listIndex: listedObjList.map((item) => item.resourceId),
      };
    },
    staleTime: 10_000,
  });
};
