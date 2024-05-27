import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getItemByGroupId, searchPurchase } from '../utils/apis';
import { Item, SearchPurchaseRequest } from '../utils/apis/types';
import { useGetBOInfoFromGroup } from './useGetBucketOrObj';
import { useGetDownloadUrl } from './apis/useGetDownloadUrl';
import { useGetPurchaseList } from './apis/useGetPurchaseList';
import { useDownload } from './apis/useDownload';
import { useGetItemByGroupId } from './apis/useGetItemByGroupId';

export type ITEM_RELATION_ADDR =
  | 'PURCHASED'
  | 'NOT_PURCHASE'
  | 'OWNER'
  | 'UNKNOWN';

/**
 * relationship between item and address
 */
export const useGetItemRelationWithAddr = (
  addr: string | undefined,
  itemId: number,
  ownerAddress: string,
) => {
  const [relation, setRelation] = useState<ITEM_RELATION_ADDR>('UNKNOWN');

  const { data, isLoading, refetch } = useGetPurchaseList({
    filter: {
      address: addr,
      itemId,
    },
    limit: 10,
    offset: 0,
    sort: 'CREATION_DESC',
  });

  useEffect(() => {
    if (!addr) return;
    if (isLoading || !data) return;

    if (addr === ownerAddress) {
      setRelation('OWNER');
      return;
    }

    if (data.purchases.length > 0) {
      setRelation('PURCHASED');
    } else {
      setRelation('NOT_PURCHASE');
    }
  }, [addr, data, isLoading, ownerAddress]);

  return {
    relation,
    refetch,
  };
};

export const useGetRelationWithAddr = (
  addr: string | undefined,
  item: Item | null,
  ownerAddress: string,
) => {
  const [relation, setRelation] = useState<ITEM_RELATION_ADDR>('UNKNOWN');

  const params: SearchPurchaseRequest = {
    filter: {
      address: addr,
      itemId: item?.id,
    },
    limit: 10,
    offset: 0,
    sort: 'CREATION_DESC',
  };

  const { data, isLoading } = useQuery({
    // enabled: false,
    queryKey: ['SEARCH_PURCHASE', params],
    queryFn: () => searchPurchase(params),
    staleTime: 10000,
  });

  const storageInfo = useGetBOInfoFromGroup(item?.groupName);

  const downloadUrl = useGetDownloadUrl({
    bucketName: storageInfo?.bucketName,
    name: item?.name || '',
  });

  const { doDownload, isLoading: isDownloading } = useDownload({
    bucketName: storageInfo?.bucketName,
    name: item?.name || '',
  });

  useEffect(() => {
    if (!addr || !data) return;

    // console.log('addr', addr, ownerAddress);

    if (addr === ownerAddress) {
      setRelation('OWNER');
      return;
    }

    if (data.purchases.length > 0) {
      setRelation('PURCHASED');
    } else {
      setRelation('NOT_PURCHASE');
    }
  }, [addr, data, ownerAddress]);

  return {
    relation,
    isLoading,
    downloadUrl,
    doDownload,
    isDownloading,
  };
};

export const useGetRelationWithGroupId = (
  addr: string | undefined,
  groupId: string,
  ownerAddress: string,
) => {
  // const [relation, setRelation] = useState<ITEM_RELATION_ADDR>('UNKNOWN');

  // const { data: item, isLoading: xxLoading } = useGetItemByGroupId(groupId);

  return useQuery({
    enabled: !!addr,
    queryKey: ['GET_ITEM_RELATION_BY_GROUP_ID', groupId, addr, ownerAddress],
    queryFn: async () => {
      let relation: ITEM_RELATION_ADDR = 'UNKNOWN';

      if (addr === ownerAddress) {
        relation = 'OWNER';
      } else {
        const item = await getItemByGroupId(groupId);

        const searchResponse = await searchPurchase({
          filter: {
            address: addr,
            itemId: item.id,
          },
          limit: 10,
          offset: 0,
          sort: 'CREATION_DESC',
        });

        if (searchResponse.purchases.length > 0) {
          relation = 'PURCHASED';
        } else {
          relation = 'NOT_PURCHASE';
        }
      }

      return {
        relation,
      };
    },
  });
};
