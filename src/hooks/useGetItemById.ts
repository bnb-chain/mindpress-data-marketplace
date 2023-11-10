import { useQuery } from '@tanstack/react-query';
import { getItemById } from '../utils/apis';
import { Item } from '../utils/apis/types';
import { useEffect, useState } from 'react';

const DEFAULT_DATA: Item = {
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
  price: '',
  status: 'LISTED',
  totalSale: 0,
  totalVolume: '',
};

/**
 * @name:
 *  if @type === 'COLLECTION', `name` is bucket name.
 *  if @type === 'OBJECT', `name` is object name.
 */
export const useGetItemById = (id: number) => {
  const [itemData, setItemData] = useState<Item>(DEFAULT_DATA);

  const { data, isLoading } = useQuery({
    queryKey: ['GET_ITEM', id],
    queryFn: () => getItemById(id),
    gcTime: 20000,
    staleTime: 10000,
    // placeholderData: DEFAULT_DATA,
  });

  useEffect(() => {
    if (isLoading || !data) return;

    setItemData(data);
  }, [data, isLoading]);

  return {
    data: itemData,
    isLoading,
  };
};
