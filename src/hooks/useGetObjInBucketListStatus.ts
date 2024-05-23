import { useQuery } from '@tanstack/react-query';
import { client } from '../utils/gfSDK';
import { getItemByObjectIds } from '../utils/apis';
import _ from 'lodash';

export const useGetObjInBucketListStatus = (
  bucketName: string,
  pageSize: number,
) => {
  return useQuery({
    queryKey: ['GET_OBJ_IN_BUCKET_LIST_STATUS', bucketName],
    queryFn: async () => {
      const endpoint = await client.sp.getSPUrlByBucket(bucketName);

      const listObjs = await client.object.listObjects({
        bucketName,
        endpoint,
        query: new URLSearchParams({
          delimiter: '/',
          prefix: '/',
          'max-keys': '1000',
        }),
      });

      // console.log('listObjs', listObjs);

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

      const subIds = _.chunk(ids, pageSize);

      const subPromise = subIds.map((sub) => {
        return getItemByObjectIds(sub);
      });

      const res = await Promise.all(subPromise);

      // had listed object list
      const listedObjList = _.flatMapDeep(res);
      // console.log('listedObjList', listedObjList);

      return {
        objsData: listObjs.body.GfSpListObjectsByBucketNameResponse.Objects,
        listIndex: listedObjList.map((item) => item.resourceId),
      };
    },
    staleTime: 10_000,
  });
};
