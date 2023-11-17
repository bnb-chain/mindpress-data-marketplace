import { Box, Button } from '@totejs/uikit';
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
import { useGetItemById } from '../../../hooks/useGetItemById';
import { getItemById, getItemByObjectId } from '../../../utils/apis';
import { useGetDownloadUrl } from '../../../hooks/useGetDownloadUrl';
import { DownloadIcon } from '@totejs/icons';

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

  const downloadUrl = useGetDownloadUrl({
    bucketName: BucketName,
    name: ObjectName,
  });

  return (
    <Box>
      {/* only owner can delist */}
      {isListed && data.Owner === address && (
        <Button
          size={'sm'}
          background="#665800"
          color="#FFE900"
          h="32px"
          fontSize="14px"
          p="8px 16px"
          onClick={() => {
            if (!objectData || !groupData) return;

            // console.log(
            //   'generateGroupName(BucketName, ObjectName)',
            //   generateGroupName(BucketName, ObjectName),
            // );

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
        </Button>
      )}

      {/* only owner can list */}
      {!isListed && data.Owner === address && (
        <Button
          size={'sm'}
          background="#665800"
          color="#FFE900"
          h="32px"
          fontSize="14px"
          p="8px 16px"
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
        </Button>
      )}

      {/* only buyer can download */}
      {isListed && isPurchasedByMe && (
        <Button
          h="32px"
          bg="none"
          color="#F1F2F3"
          border="1px solid #F1F2F3"
          fontSize="14px"
          p="8px 16px"
          _hover={{
            background: '#E1E2E5',
            color: '#181A1E',
          }}
          onClick={() => {
            window.open(downloadUrl);
          }}
        >
          <DownloadIcon />
          <Box as="span" ml="8px">
            Download
          </Box>
        </Button>
      )}

      {/* haven't bought can buy excepy owner */}
      {isListed && !isPurchasedByMe && data.Owner !== address && (
        <Button
          size={'sm'}
          background="#665800"
          color="#FFE900"
          h="32px"
          fontSize="14px"
          p="8px 16px"
          onClick={async () => {
            // console.log('isPurchasedByMe', isPurchasedByMe);
            if (!objectData) return;

            const itemInfo = await getItemByObjectId(objectData.objectInfo.id);
            modalData.modalDispatch({
              type: 'OPEN_BUY',
              buyData: itemInfo,
              callBack: () => {
                uploadFn();
              },
            });
          }}
        >
          Only Buy This
        </Button>
      )}
    </Box>
  );
};
