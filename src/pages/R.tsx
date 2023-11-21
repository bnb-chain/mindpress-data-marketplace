import { Box } from '@totejs/uikit';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../components/Loader';
import { useRedirectFromExternal } from '../hooks/useRedirectFromExternal';
import { useWalletModal } from '../hooks/useWalletModal';
import NiceModal from '@ebay/nice-modal-react';
import { Tips } from '../components/modal/Tips';
import { trimLongStr } from '../utils';
import styled from '@emotion/styled';

export const R = () => {
  const navigator = useNavigate();
  const {
    account,
    accountStatus,
    resourceBid,
    resourceOid,
    detailBid,
    detailOid,
  } = useRedirectFromExternal();

  const { handleModalOpen } = useWalletModal();

  console.log(
    'status',
    accountStatus,
    resourceBid,
    resourceOid,
    detailBid,
    detailOid,
  );

  const bucketIsListed = useMemo(() => {
    return !_.isEmpty(resourceBid);
  }, [resourceBid?.id]);

  const objectIsListed = useMemo(() => {
    return !_.isEmpty(resourceOid) && resourceOid.id !== 0;
  }, [resourceOid.id]);

  useEffect(() => {
    let url = '';
    if (accountStatus !== 'SAME_ACCOUNT') {
      url = '/';
    } else {
      if (!_.isEmpty(resourceBid)) {
        url = `/resource?id=${resourceBid.id}`;
      } else if (!_.isEmpty(resourceOid) && resourceOid.id !== 0) {
        url = `/resource?id=${resourceOid.id}`;
      } else {
        if (!_.isEmpty(detailBid)) {
          if (detailBid.bucketInfo && !detailOid?.objectInfo) {
            console.log('xx', bucketIsListed);
            url = `/detail?bid=${detailBid.bucketInfo.id}`;

            if (!bucketIsListed) {
              url += '&openModal=1';
            }
          } else {
            url = `/detail?bid=${detailBid.bucketInfo.id}&oid=${detailOid?.objectInfo.id}`;
            if (!objectIsListed) {
              url += '&openModal=1';
            }
          }
        }
      }
    }

    navigator(url, {
      replace: true,
    });
    console.log('url', url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    detailBid?.bucketInfo.id,
    detailOid?.objectInfo.id,
    resourceBid?.id,
    resourceOid.id,
  ]);

  useEffect(() => {
    if (accountStatus === 'NOT_LOGIN') {
      handleModalOpen();
      return;
    }
    if (accountStatus === 'ACCOUNT_IS_NOT_SAME') {
      NiceModal.show(Tips, {
        title: `Please switch to correct account`,
        content: (
          <SwitchCorrectAccount>{trimLongStr(account)}</SwitchCorrectAccount>
        ),
      });
      return;
    }

    if (accountStatus === 'SAME_ACCOUNT') {
      if (bucketIsListed || objectIsListed) {
        NiceModal.show(Tips, {
          title: `Already Listed`,
          content: <Box></Box>,
        });
      } else {
        // ...
      }
      return;
    }
  }, [account, accountStatus]);

  return (
    <Box>
      <Loader />
    </Box>
  );
};
const SwitchCorrectAccount = styled(Box)`
  display: inline-block;
  padding: 0 15px;
  background: #cdcdcd;
  line-height: 30px;
  border-radius: 15px;
`;
