import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useGetBucketById } from './useGetBucketOrObj';
import { useGetItemByBucketId } from './gnfd/useGetItemByBucketId';
import { useGetItemByObjId } from './apis/useGetItemByObjId';
import { useGfGetObjInfo } from './gnfd/useGfGetObjInfo';

/**
 * Hook to redirect from external links.
 * eg. dcellar
 */

type UserStatus = 'NOT_LOGIN' | 'ACCOUNT_IS_NOT_SAME' | 'SAME_ACCOUNT';

export const useRedirectFromExternal = () => {
  const [p] = useSearchParams();
  // const [userStatus, setUserStatus] = useState<UserStatus>('NOT_LOGIN');

  const addressFromDcellar = p.get('address') as string;
  const bid = p.get('bid') as string;
  const oid = p.get('oid') as string;

  const { address: myAddress } = useAccount();

  const accountStatus: UserStatus = useMemo(() => {
    if (!myAddress) {
      // not login
      return 'NOT_LOGIN';
    }

    if (myAddress !== addressFromDcellar) {
      // don't same address with dcellar
      return 'ACCOUNT_IS_NOT_SAME';
    }

    return 'SAME_ACCOUNT';
  }, [addressFromDcellar, myAddress]);

  // get item
  const { data: resourceBid } = useGetItemByBucketId(bid);
  const { data: resourceOid } = useGetItemByObjId(oid);

  const { data: detailBid } = useGetBucketById(bid);
  const { data: detailOid } = useGfGetObjInfo(oid);

  return {
    account: addressFromDcellar,
    accountStatus,
    resourceBid,
    resourceOid,
    detailBid,
    detailOid,
  };
};
