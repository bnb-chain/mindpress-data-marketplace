import styled from '@emotion/styled';
import { SendIcon } from '@totejs/icons';
import { Button, Flex } from '@totejs/uikit';
import _ from 'lodash';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { NoData } from '../../components/NoData';
import { DCELLAR_URL, GF_EXPLORER_URL } from '../../env';
import { useCollectionItems } from '../../hooks/useCollectionItems';
import { useGetBucketById } from '../../hooks/useGetBucketOrObj';
import { useGetItemByObjId } from '../../hooks/useGetItemByObjId';
import { useGfGetObjInfo } from '../../hooks/useGfGetObjInfo';
import { useModal } from '../../hooks/useModal';
import { useStatus } from '../../hooks/useStatus';
import {
  defaultImg,
  formatDateUTC,
  generateGroupName,
  parseFileSize,
  trimLongStr,
} from '../../utils';
import { useCallback, useEffect } from 'react';
import { YellowButton } from '../ui/buttons/YellowButton';
import { BlackButton } from '../ui/buttons/BlackButton';

/**
 * Have not been listed
 * Show bucket or object detail info
 */
export const Object = () => {
  const navigator = useNavigate();
  const [p] = useSearchParams();
  const objectId = p.get('oid') as string;
  const bucketId = p.get('bid') as string;
  const modalData = useModal();

  const { data: bucketData } = useGetBucketById(bucketId);
  const { data: objectData } = useGfGetObjInfo(objectId);

  // if objectItemInfo is `{}`,
  // means this object is not listed
  const { data: objectItemInfo } = useGetItemByObjId(objectId);

  // console.log('objectItemInfo', objectItemInfo);

  const { address } = useAccount();
  const { num } = useCollectionItems(bucketData?.bucketInfo.bucketName, false);

  const openListModal = useCallback(() => {
    if (!bucketData || !objectData) return;
    const initInfo = {
      bucket_name: bucketData.bucketInfo.bucketName,
      object_name: objectData.objectInfo.objectName,
      create_at: bucketData.bucketInfo.createAt.low,
      payload_size: objectData.objectInfo.payloadSize.low,
    };
    modalData.modalDispatch({
      type: 'OPEN_LIST',
      initInfo,
    });
  }, [bucketData, modalData, objectData]);

  // auto open list modal
  useEffect(() => {
    const needOpenModal = p.get('openModal') as string;
    if (!needOpenModal) return;
    openListModal();
  }, [p, bucketData, objectData]);

  if (!_.isEmpty(objectItemInfo)) {
    navigator(`/resource?id=${objectItemInfo.id}`, {
      replace: true,
    });
  }

  if (!objectData || !bucketData) {
    return <NoData />;
  }

  return (
    <>
      <ResourceInfo gap={20}>
        <ImgCon>
          <img src={defaultImg(objectData.objectInfo.objectName, 246)} alt="" />
        </ImgCon>
        <Info
          gap={4}
          flexDirection={['column', 'column', 'column']}
          justifyContent={'space-around'}
        >
          <NameCon gap={4} alignItems={'center'} justifyContent={'flex-start'}>
            <Name>{objectData.objectInfo.objectName}</Name>
            <SendIcon
              width={20}
              height={20}
              cursor={'pointer'}
              marginLeft={6}
              onClick={() => {
                // const o = resourceType == '1' ? bucketInfo : objectInfo;
                window.open(
                  `${GF_EXPLORER_URL}bucket/0x${Number(bucketId)
                    .toString(16)
                    .padStart(64, '0')}`,
                );
              }}
            />
          </NameCon>

          {/* if bucket */}
          <CollInfo gap={8}>
            <ItemNum>{num} Items</ItemNum>
            <Tag alignItems={'center'} justifyContent={'center'}>
              Collection
            </Tag>
          </CollInfo>

          <OwnCon alignItems={'center'}>
            <FileSize>
              {parseFileSize(objectData.objectInfo.payloadSize.low)}
            </FileSize>
            Created by{' '}
            {address === objectData.objectInfo.owner ? (
              <span>You</span>
            ) : (
              <Link to={`/profile?address=${objectData.objectInfo.owner}`}>
                <span>{trimLongStr(objectData.objectInfo.owner)}</span>
              </Link>
            )}{' '}
            At {formatDateUTC(objectData.objectInfo.createAt.low * 1000)}
          </OwnCon>

          <ActionGroup gap={10} alignItems={'center'}>
            {address === objectData.objectInfo.owner &&
              _.isEmpty(objectItemInfo) && (
                <YellowButton size={'sm'} onClick={openListModal}>
                  List
                </YellowButton>
              )}

            <BlackButton
              size={'sm'}
              onClick={() => {
                window.open(
                  `${DCELLAR_URL}buckets/${bucketData.bucketInfo.bucketName}`,
                );
              }}
              variant="ghost"
            >
              View in Dcellar
            </BlackButton>
          </ActionGroup>
        </Info>
      </ResourceInfo>
    </>
  );
};

const ResourceInfo = styled(Flex)`
  margin-top: 30px;
`;

const ImgCon = styled.div`
  position: relative;
  width: 246px;
  height: 246px;

  img {
    width: 246px;
    height: 246px;

    background-color: #d9d9d9;
    border-radius: 8px;
  }
`;

const Info = styled(Flex)``;

const NameCon = styled(Flex)``;

const CollInfo = styled(Flex)``;

const Name = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 38px;
  /* identical to box height, or 119% */

  color: #ffe900;
`;

const Tag = styled(Flex)`
  width: 128px;
  height: 24px;

  background: rgba(255, 255, 255, 0.14);
  border-radius: 16px;
`;

const ItemNum = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;

  color: #ffffff;
`;

const OwnCon = styled(Flex)`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;

  color: #ffffff;

  span {
    margin: 0 4px;
    color: #ffe900;
  }
`;

const ActionGroup = styled(Flex)``;

const FileSize = styled.div`
  margin-right: 6px;

  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 18px;

  color: #ffffff;
`;
