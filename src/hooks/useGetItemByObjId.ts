import { useQueries, useQuery } from '@tanstack/react-query';
import {
  getItemByObjectId,
  getItemByObjectIds,
  queryPurchase,
  searchPurchase,
} from '../utils/apis';
import { DEFAULT_ITEM } from './useGetItemById';
import _ from 'lodash';
import { useAccount } from 'wagmi';

/**
 *
 * get object list: isPurchased / isListed
 */
/* export const useGetItemsStatusByObjIds = (
  address: string,
  objectIdList: number[],
) => {
  return useQueries({
    queries: objectIdList.map((objectId) => {
      return {
        queryKey: ['GET_ITEM_BY_OBJECT_IDS', address, objectId],
        queryFn: async () => {
          const objRes = await getItemByObjectId(String(objectId));
          let isList = false;
          let isPurchased = false;

          if (!_.isEmpty(objRes)) {
            isList = true;
          }

          const purRes = await searchPurchase({
            filter: {
              address,
              objectId: objectId,
            },
            offset: 0,
            limit: 10,
            sort: 'CREATION_DESC',
          });

          if (purRes.purchases.length > 0) {
            isPurchased = true;
          }

          // console.log('res', objectId, isList, isPurchased);

          return {
            [objectId]: {
              isList,
              isPurchased,
            },
          };
        },
      };
    }),
  });
}; */

export const useGetItemsByObjIds = (ids: number[]) => {
  return useQuery({
    enabled: ids.length !== 0,
    queryKey: ['GET_ITEM_BY_OBJECT_IDS', ids],
    queryFn: async () => {
      const res = await getItemByObjectIds(ids);

      return res
        .filter((item) => {
          return ids.includes(item.resourceId);
        })
        .map((item) => {
          return item.resourceId;
        });
    },
  });
};

export const usePurchaseQueryByObjIds = (
  address: string | undefined,
  ids: number[],
) => {
  return useQuery({
    enabled: !!address && ids.length !== 0,
    queryKey: ['PURCHARGE_QUERY', address],
    queryFn: async () => {
      const res = await queryPurchase({
        filter: {
          address,
          objectIds: ids,
        },
        offset: 0,
        limit: 10,
        sort: 'CREATION_DESC',
      });

      const { purchases } = res;

      const xx = purchases
        .filter((p) => {
          return ids.includes(p.item.resourceId);
        })
        .map((p) => {
          return p.item.resourceId;
        });

      return xx;
    },
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
