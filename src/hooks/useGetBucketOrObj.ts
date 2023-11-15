import { useQuery } from '@tanstack/react-query';
import { parseGroupName } from '../utils';
import { Item } from '../utils/apis/types';
import {
  getCollectionInfo,
  getCollectionInfoByName,
  getGroupInfoByName,
  getObjectInfoByName,
} from '../utils/gfSDK';
import { useEffect, useState } from 'react';

export const useGetBucketByName = (bucketName?: string) => {
  return useQuery({
    enabled: !!bucketName,
    queryKey: ['GET_BUCKET_BY_NAME', bucketName],
    queryFn: async () => {
      if (!bucketName) return;
      const res = await getCollectionInfoByName(bucketName);
      return res;
    },
    gcTime: Infinity,
    staleTime: Infinity,
  });
};

export const useGetBucketById = (bucketId?: string) => {
  return useQuery({
    enabled: !!bucketId,
    queryKey: ['GET_BUCKET_BY_ID', bucketId],
    queryFn: async () => {
      if (!bucketId) return;
      const res = await getCollectionInfo(bucketId);
      return res;
    },
    gcTime: Infinity,
    staleTime: Infinity,
  });
};

export const useGetObject = (bucketName?: string, objectName?: string) => {
  return useQuery({
    enabled: !!bucketName && !!objectName,
    queryKey: ['GET_OBJECT', bucketName, objectName],
    queryFn: async () => {
      if (!bucketName || !objectName) return;
      const res = await getObjectInfoByName(bucketName, objectName);
      return res;
    },
    gcTime: Infinity,
    staleTime: Infinity,
  });
};

export const useGetGroupByName = (
  groupName: string | undefined,
  ownerAddress: string | undefined,
) => {
  return useQuery({
    enabled: !!groupName && !!ownerAddress,
    queryKey: ['GET_GROUP', groupName, ownerAddress],
    queryFn: async () => {
      if (!groupName || !ownerAddress) return;
      const res = await getGroupInfoByName(groupName, ownerAddress);
      // console.log('group res', res);
      return res;
    },
    // gcTime: Infinity,
    // staleTime: Infinity,
  });
};

/**
 * get bucket or object info by group name
 */
export const useGetBOInfoFromGroup = (groupName?: string) => {
  const [boInfo, setBoInfo] = useState<{
    type: Item['type'];
    bucketName: string;
    objectName: string;
  }>();

  useEffect(() => {
    if (!groupName) return;

    const { bucketName, name, type } = parseGroupName(groupName);
    // console.log('_', _, name, type);
    let objectName = '';
    // let bucketName = '';
    let rType: Item['type'] = 'COLLECTION';
    if (type === 'Data') {
      rType = 'OBJECT';
      objectName = name;
      // bucketName = _;
    }

    console.log({
      type: rType,
      bucketName,
      objectName,
    });
    setBoInfo({
      type: rType,
      bucketName,
      objectName,
    });
  }, [groupName]);

  return boInfo;
};

// export type StorageInfoResponse = Awaited<
//   ReturnType<typeof getChainInfoByGroupName>
// >;
// const getChainInfoByGroupName = async (groupName?: string) => {
//   console.log('groupName: ', groupName);
//   if (!groupName) return;
//   const { bucketName: _, name, type } = parseGroupName(groupName);
//   let objectName = '';
//   let bucketName = '';
//   let rType: Item['type'] = 'COLLECTION';
//   if (type === 'Data') {
//     rType = 'OBJECT';
//     objectName = name;
//     bucketName = _;
//   }

//   console.log('bucketName: ', bucketName);
//   const bucket = await getCollectionInfoByName(bucketName);
//   const bucketInfo = bucket.bucketInfo;
//   console.log('bucketInfo: ', bucketInfo);

//   let objectInfo;
//   if (objectName) {
//     objectInfo = (await getObjectInfoByName(bucketName, objectName)).objectInfo;
//   }

//   return {
//     type: rType,
//     bucketInfo,
//     objectInfo,
//   };
// };

// export const useGetStorageInfoByGroupName = (groupName: string | undefined) => {
//   return useQuery({
//     enabled: !!groupName,
//     queryKey: ['GET_CHAIN_INFO_BY_GROUP_NAME', groupName],
//     queryFn: () => getChainInfoByGroupName(groupName),
//     gcTime: Infinity,
//     staleTime: Infinity,
//   });
// };
