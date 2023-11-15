import { useQueries, useQuery } from '@tanstack/react-query';
import { getItemByObjectId } from '../utils/apis';
import { DEFAULT_ITEM } from './useGetItemById';

export const useGetItemsByObjIds = (objectIdList: string[]) => {
  return useQueries({
    queries: objectIdList.map((objectId) => {
      return {
        queryKey: ['GET_ITEM_BY_OBJECT_ID', objectId],
        queryFn: async () => {
          const res = await getItemByObjectId(objectId);
          return res;
        },
      };
    }),
  });
};

export const useGetItemByObjId = (objectId: string) => {
  return useQuery({
    enabled: !!objectId,
    queryKey: ['GET_ITEM_BY_OBJECT_ID', objectId],
    queryFn: async () => {
      const res = await getItemByObjectId(objectId);
      // console.log('res', res);
      // if (!res) {
      // console.log('running', objectId);
      // const objectInfo = await getObjectInfo(objectId);
      // console.log('running222');
      // console.log('objectInfo', objectInfo);
      // }
      return res;
    },
    // gcTime: Infinity,
    // staleTime: Infinity,
    initialData: DEFAULT_ITEM,
  });
};

// const convertObjectInfoToItem = (objectInfo: QueryHeadObjectResponse['objectInfo']): Item => {
//   return {
//     id: objectInfo.id,
//     categoryId: objectInfo.categoryId,
//     type: objectInfo.,
//     name: objectInfo.name,
//     createdAt: objectInfo.createdAt,
//     description: objectInfo.description,
//     url: objectInfo.url,
//     groupId: objectInfo.groupId,
//     groupName: objectInfo.groupName,
//     ownerAddress: objectInfo.ownerAddress,
//     price: objectInfo.price,
//     status: objectInfo.status,
//     totalSale: objectInfo.totalSale,
//     totalVolume: objectInfo.totalVolume,
//   }
// }
