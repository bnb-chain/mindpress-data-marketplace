import { useQuery } from '@tanstack/react-query';
import { client, getRandomSp } from '../utils/gfSDK';

interface Params {
  bucketName: string;
  prefix: string;
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

export type OBJECT_ITEM =
  | {
      type: 'file';
      name: string;
      data: ObjectInfo;
    }
  | {
      type: 'folder';
      name: string;
    };

export const useGetObjectList = (params: Params) => {
  return useQuery({
    queryKey: ['GET_BUCKET_LIST', params.bucketName, params.prefix],
    queryFn: async () => {
      return await getObjectList(params);
    },
    gcTime: Infinity,
    staleTime: Infinity,
  });
};

const getObjectList = async (params: Params) => {
  const { bucketName, prefix } = params;
  const _query = new URLSearchParams();
  _query.append('delimiter', '/');
  _query.append('maxKeys', '1000');
  _query.append('prefix', prefix);

  const endpoint = await getRandomSp();
  const res = await client.object.listObjects({
    bucketName,
    endpoint,
    query: _query,
  });

  if (!res || !res.body) return null;

  return [];

  // const { CommonPrefixes, Objects } =
  //   res.body.GfSpListObjectsByBucketNameResponse;

  // const folderList /* : OBJECT_ITEM[] */ = CommonPrefixes.map((cp: any) => {
  //   return {
  //     type: 'folder',
  //     name: cp.slice(0, -1),
  //   };
  // });

  // const fileList /* : OBJECT_ITEM[] */ = Objects.map((fileL: any) => {
  //   return {
  //     type: 'file',
  //     name: file.ObjectInfo.ObjectName,
  //     data: file.ObjectInfo,
  //   };
  // });

  // return folderList.concat(fileList);
};
