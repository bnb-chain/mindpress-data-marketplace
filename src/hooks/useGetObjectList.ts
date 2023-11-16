import { useQuery } from '@tanstack/react-query';
import { client, getRandomSp } from '../utils/gfSDK';

interface Params {
  bucketName: string;
  path: string;
}

// type ListObjectsByBucketNameResponse = Awaited<
//   ReturnType<typeof client.object.listObjects>
// >;

type ObjectInfo = {
  BucketName: string;
  Checksums: string[];
  ContentType: string;
  CreateAt: number;
  Creator: string;
  Id: number;
  LocalVirtualGroupId: number;
  ObjectName: string;
  ObjectStatus: number;
  Owner: string;
  PayloadSize: number;
  RedundancyType: number;
  SourceType: number;
  Visibility: number;
};

export type FILE_ITEM = {
  type: 'file';
  name: string;
  data: ObjectInfo;
  /**
   * be list or not
   */
  isListed: boolean;
  /**
   * bought by me or not
   */
  isPurchasedByMe: boolean;
};

export type FOLDER_ITEM = {
  type: 'folder';
  name: string;
  path: string;
};

export type OBJECT_ITEM = FOLDER_ITEM | FILE_ITEM;

export const useGetObjectList = (params: Params) => {
  return useQuery({
    queryKey: ['GET_BUCKET_LIST', params.bucketName, params.path],
    queryFn: async () => {
      return await getObjectList(params);
    },
    gcTime: Infinity,
    staleTime: Infinity,
  });
};

export const objListMergeListedAndPurchased = (
  objectList: OBJECT_ITEM[] | undefined | null,
  listedList: number[] | undefined,
  purchasedList: number[] | undefined,
) => {
  console.log(
    'objListMergeListedAndPurchased objectList',
    objectList,
    listedList,
    purchasedList,
  );
  if (!objectList) return [];
  if (!listedList || !purchasedList) return objectList;

  const res = objectList.map((item) => {
    if (item.type === 'file') {
      if (listedList.includes(item.data.Id)) {
        item.isListed = true;
      } else {
        item.isListed = false;
      }

      if (purchasedList.includes(item.data.Id)) {
        item.isPurchasedByMe = true;
      } else {
        item.isPurchasedByMe = false;
      }
    }

    return item;
  });

  return res;
};

const getObjectList = async (params: Params) => {
  const { bucketName, path } = params;

  const _query = new URLSearchParams();
  _query.append('delimiter', '/');
  _query.append('maxKeys', '1000');
  _query.append('prefix', path || '/');

  const endpoint = await getRandomSp();
  const res = await client.object.listObjects({
    bucketName,
    endpoint,
    query: _query,
  });

  if (!res || !res.body) return null;

  // console.log('res', bucketName, path, endpoint, res);

  const { CommonPrefixes, Objects } =
    res.body.GfSpListObjectsByBucketNameResponse;

  const folderList: OBJECT_ITEM[] = CommonPrefixes.map((cp) => {
    // console.log('cp', cp, prefix);
    return {
      type: 'folder',
      name: cp.slice(0, -1),
      path: '',
    };
  });

  const fileList: OBJECT_ITEM[] = Objects.filter((file) => {
    return !file.ObjectInfo.ObjectName.endsWith('/');
  }).map((file) => {
    return {
      type: 'file',
      name: file.ObjectInfo.ObjectName,
      data: file.ObjectInfo,
      isListed: false,
      isPurchasedByMe: false,
    };
  });

  return folderList.concat(fileList);
};

// export const useGetGroupListInfo = (groupNameList: string[]) => {
//   const { address } = useAccount();
//   return useQueries({
//     queries: groupNameList.map((groupName) => {
//       return {
//         queryKey: ['GET_GROUP', groupName, address],
//         queryFn: async () => {
//           if (!groupName || !address) return;

//           const res = await getGroupInfoByName(groupName, address);
//           console.log('group res', groupName, address, res);
//           return res;
//         },
//       };
//     }),
//   });
// };
