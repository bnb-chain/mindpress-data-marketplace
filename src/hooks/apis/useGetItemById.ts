import { useQuery } from '@tanstack/react-query';
import { getItemById } from '../../utils/apis';
import { Item } from '../../utils/apis/types';
import { useEffect, useState } from 'react';

export const DEFAULT_ITEM: Item = {
  id: 0,
  categoryId: 0,
  type: 'OBJECT',
  name: '',
  createdAt: 0,
  description: '',
  url: '',
  groupId: 0,
  groupName: '',
  ownerAddress: '',
  resourceId: 0,
  price: '',
  status: 'LISTED',
  totalSale: 0,
  totalVolume: '',
};

/**
 * name:
 *   if @type === 'COLLECTION', `name` is bucket name.
 *   if @type === 'OBJECT', `name` is object name.
 */
export const useGetItemById = (id: number) => {
  const [itemData, setItemData] = useState<Item>();

  const { data, isLoading, refetch } = useQuery({
    enabled: !!id,
    queryKey: ['GET_ITEM', id],
    queryFn: () => getItemById(id),
    gcTime: 20000,
    staleTime: 10000,
    // placeholderData: DEFAULT_DATA,
  });

  useEffect(() => {
    if (isLoading || !data || !id) return;

    setItemData(data);
  }, [data, id, isLoading]);

  return {
    data: itemData,
    isLoading,
    refetch,
  };
};
