import { useQuery } from '@tanstack/react-query';
import { parseGroupName } from '../utils';
import { Item } from '../utils/apis/types';
import { getCollectionInfoByName, getObjectInfoByName } from '../utils/gfSDK';

export const useGetBucket = (name: string) => {
  return useQuery({
    queryKey: ['GET_BUCKET', name],
    queryFn: () => getCollectionInfoByName(name),
    gcTime: 20000,
    staleTime: 10000,
  });
};

export const useGetObject = (bucketName: string, objectName: string) => {
  return useQuery({
    queryKey: ['GET_OBJECT', bucketName, objectName],
    queryFn: () => getObjectInfoByName(bucketName, objectName),
    gcTime: 20000,
    staleTime: 10000,
  });
};

const getChainInfoByGroupName = async (groupName: string) => {
  const { bucketName: _, name, type } = parseGroupName(groupName);
  let objectName = '';
  let bucketName = '';
  let rType: Item['type'] = 'COLLECTION';
  if (type === 'Data') {
    rType = 'OBJECT';
    objectName = name;
    bucketName = _;
  }

  const bucketInfo = (await getCollectionInfoByName(bucketName)).bucketInfo;

  let objectInfo;
  if (objectName) {
    objectInfo = (await getObjectInfoByName(bucketName, objectName)).objectInfo;
  }

  return {
    type: rType,
    bucketInfo,
    objectInfo,
  };
};

export const useGetStorageInfoByGroupName = (groupName: string) => {
  return useQuery({
    queryKey: ['GET_CHAIN_INFO_BY_GROUP_NAME', groupName],
    queryFn: () => getChainInfoByGroupName(groupName),
    gcTime: Infinity,
    staleTime: Infinity,
  });
};
