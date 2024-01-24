import { DownloadIcon } from '@totejs/icons';
import { Box } from '@totejs/uikit';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import {
  useGetBucketByName,
  useGetGroupByName,
  useGetObject,
} from '../../../hooks/useGetBucketOrObj';
import { useGetDownloadUrl } from '../../../hooks/useGetDownloadUrl';
import { FILE_ITEM } from '../../../hooks/useGetObjectList';
import { useGetPurchaseList } from '../../../hooks/useGetPurchaseList';
import { useModal } from '../../../hooks/useModal';
import { generateGroupName } from '../../../utils';
import { getItemByObjectId } from '../../../utils/apis';
import { BlackButton } from '../../ui/buttons/BlackButton';
import { YellowButton } from '../../ui/buttons/YellowButton';
import { useSetAtom } from 'jotai';
import { buyAtom } from '../../../atoms/buyAtom';
import { useImmerAtom } from 'jotai-immer';

interface Props {
  fileInfo: FILE_ITEM;
  uploadFn: () => void;
}

export const ActionButtonGroup = (props: Props) => {
  const { fileInfo, uploadFn } = props;
  const { data, isListed, isPurchasedByMe } = fileInfo;
  const { BucketName, ObjectName } = data;
  const { address } = useAccount();
  const modalData = useModal();
  const [, setBuy] = useImmerAtom(buyAtom);

  const { data: bucketData } = useGetBucketByName(BucketName);
  const { data: objectData } = useGetObject(BucketName, ObjectName);
  const { data: groupData } = useGetGroupByName(
    generateGroupName(BucketName, ObjectName),
    data.Owner,
  );

  const { data: bucketPurchased } = useGetPurchaseList({
    filter: {
      address,
      bucketId: Number(bucketData?.bucketInfo.id),
    },
    limit: 10,
    offset: 0,
    sort: 'CREATION_DESC',
  });

  const isCollectionPurchasedByMe =
    bucketPurchased && bucketPurchased.purchases?.length > 0;

  const downloadUrl = useGetDownloadUrl({
    bucketName: BucketName,
    name: ObjectName,
  });

  /* not login account can't show */
  /* bought collection can view every data in this collection */
  /* if user only buy data can download too*/
  const showDownload = useMemo(() => {
    if (!address) return false;
    if (isCollectionPurchasedByMe) return true;
    if (isListed && isPurchasedByMe) return true;
    return false;
  }, [address, isCollectionPurchasedByMe, isListed, isPurchasedByMe]);

  return (
    <Box>
      {/* only owner can delist */}
      {isListed && data.Owner === address && (
        <YellowButton
          onClick={() => {
            if (!objectData || !groupData) return;
            modalData.modalDispatch({
              type: 'OPEN_DELIST',
              delistData: {
                groupId: groupData.groupInfo.id,
                bucket_name: BucketName,
                object_name: ObjectName,
                create_at: objectData.objectInfo.createAt.low,
                owner: objectData.objectInfo.owner,
              },
              callBack: () => {
                uploadFn();
              },
            });
          }}
        >
          delist
        </YellowButton>
      )}

      {/* only owner can list */}
      {!isListed && data.Owner === address && (
        <YellowButton
          onClick={() => {
            if (!bucketData || !objectData) return;

            const initInfo = {
              bucket_name: BucketName,
              object_name: objectData.objectInfo.objectName,
              create_at: objectData.objectInfo.createAt.low,
              payload_size: objectData.objectInfo.payloadSize,
            };
            modalData.modalDispatch({
              type: 'OPEN_LIST',
              initInfo,
              callBack: () => {
                uploadFn();
              },
            });
          }}
        >
          list
        </YellowButton>
      )}

      {showDownload && (
        <BlackButton
          onClick={() => {
            window.open(downloadUrl);
          }}
        >
          <DownloadIcon />
          <Box as="span" ml="8px">
            Download
          </Box>
        </BlackButton>
      )}

      {/* haven't bought can buy excepy owner */}
      {isListed && !isPurchasedByMe && data.Owner !== address && (
        <YellowButton
          onClick={async () => {
            // console.log('isPurchasedByMe', isPurchasedByMe);
            if (!objectData) return;

            const itemInfo = await getItemByObjectId(objectData.objectInfo.id);

            setBuy((draft) => {
              draft.openDrawer = true;
              draft.buying = false;
              draft.buyData = itemInfo;
            });
          }}
        >
          Only Buy This
        </YellowButton>
      )}
    </Box>
  );
};
