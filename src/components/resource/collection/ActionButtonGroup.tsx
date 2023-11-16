import { Box } from '@totejs/uikit';
import { FILE_ITEM } from '../../../hooks/useGetObjectList';
import { useAccount } from 'wagmi';
import { useMemo } from 'react';
import { useModal } from '../../../hooks/useModal';
import {
  useGetBucketByName,
  useGetGroupByName,
  useGetObject,
} from '../../../hooks/useGetBucketOrObj';
import { generateGroupName } from '../../../utils';

interface Props {
  fileInfo: FILE_ITEM;
  uploadFn: () => void;
}

export const ActionButtonGroup = (props: Props) => {
  const { fileInfo, uploadFn } = props;
  const { name, type, data, isListed, isPurchasedByMe } = fileInfo;
  const { BucketName, ObjectName } = data;
  const { address } = useAccount();
  const modalData = useModal();

  const { data: bucketData } = useGetBucketByName(BucketName);
  const { data: objectData } = useGetObject(BucketName, ObjectName);

  const { data: groupData } = useGetGroupByName(
    generateGroupName(BucketName, ObjectName),
    data.Owner,
  );

  return (
    <Box>
      {/* only owner can delist */}
      {isListed && data.Owner === address && (
        <Box
          onClick={() => {
            if (!objectData || !groupData) return;

            console.log(
              'generateGroupName(BucketName, ObjectName)',
              generateGroupName(BucketName, ObjectName),
            );

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
        </Box>
      )}

      {/* only owner can list */}
      {!isListed && data.Owner === address && (
        <Box
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
        </Box>
      )}

      {/* only buyer can download */}
      {isPurchasedByMe && <Box>download</Box>}

      {/* haven't bought can buy excepy owner */}
      {!isPurchasedByMe && data.Owner !== address && <Box>Buy</Box>}
    </Box>
  );
};
