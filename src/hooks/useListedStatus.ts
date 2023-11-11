import { useCallback, useEffect, useState } from 'react';
import { getItemByGroupId } from '../utils/apis';

export const useListedStatus = (groupId?: string) => {
  const [listStatus, setListStatus] = useState(false);
  const [price, setPrice] = useState(0);
  const checkListed = useCallback(async (groupId: string) => {
    if (groupId) {
      const result = await getItemByGroupId(groupId);
      const { price, status } = result;
      if (status === 'LISTED') {
        setPrice(price);
        setListStatus(true);
        return result;
      }
    }
    return false;
  }, []);

  useEffect(() => {
    groupId && checkListed(groupId);
  }, [checkListed, groupId]);
  return { checkListed, listStatus, price };
};
