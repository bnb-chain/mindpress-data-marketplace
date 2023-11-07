import { useEffect, useState } from 'react';

export type ITEM_STATUS =
  | 'LISTED_BY_ME'
  | 'PURCHASED_BY_ME'
  | 'NOT_PURCHASED_BY_ME';

export const useItemStatus = (isOwner: boolean, hasOwner: boolean) => {
  const [status, setStatus] = useState<ITEM_STATUS>('NOT_PURCHASED_BY_ME');

  useEffect(() => {
    if (isOwner) {
      setStatus('LISTED_BY_ME');
    } else {
      if (hasOwner) {
        setStatus('PURCHASED_BY_ME');
      } else {
        setStatus('NOT_PURCHASED_BY_ME');
      }
    }
  }, [isOwner, hasOwner]);

  return status;
};
