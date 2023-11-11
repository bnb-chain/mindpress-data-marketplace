import { useEffect, useState } from 'react';
import { Item } from '../utils/apis/types';
import { useGetPurchaseList } from './useGetPurchaseList';

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
  item: Item | undefined,
) => {
  const [relation, setRelation] = useState<ITEM_RELATION_ADDR>('UNKNOWN');

  const { data, isLoading } = useGetPurchaseList({
    filter: {
      address: addr,
      itemId: item?.id,
    },
    limit: 10,
    offset: 0,
    sort: 'CREATION_DESC',
  });

  useEffect(() => {
    if (!addr || !item) return;
    if (isLoading || !data) return;

    if (addr === item.ownerAddress) {
      setRelation('OWNER');
      return;
    }

    if (data.purchases.length > 0) {
      setRelation('PURCHASED');
    } else {
      setRelation('NOT_PURCHASE');
    }
  }, [addr, data, isLoading, item]);

  return relation;
};
