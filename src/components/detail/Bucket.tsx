import styled from '@emotion/styled';
import { SendIcon } from '@totejs/icons';
import { Box, Button, Flex } from '@totejs/uikit';
import _ from 'lodash';
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { useAccount } from 'wagmi';
import { NoData } from '../../components/NoData';
import List from '../../components/detail/List';
import { DCELLAR_URL, GF_EXPLORER_URL } from '../../env';
import { useCollectionItems } from '../../hooks/useCollectionItems';
import { useGetBucketById } from '../../hooks/useGetBucketOrObj';
import { useGetItemByBucketId } from '../../hooks/useGetItemByBucketId';
import { useModal } from '../../hooks/useModal';
import { useStatus } from '../../hooks/useStatus';
import {
  defaultImg,
  formatDateUTC,
  generateGroupName,
  trimLongStr,
} from '../../utils';
import { useCallback, useEffect } from 'react';
import { BlackButton } from '../ui/buttons/BlackButton';

/**
 * Have not been listed
 * Show bucket or object detail info
 */
export const Bucket = () => {
  const [p] = useSearchParams();

  const bucketId = p.get('bid') as string;
  const modalData = useModal();

  const { data: bucketData } = useGetBucketById(bucketId);

  // if bucketItemInfo is `{}`,
  // means this bucket is not listed
  // const { data: bucketItemInfo } = useGetItemByBucketId(bucketId);

  const { address } = useAccount();
  const { num } = useCollectionItems(bucketData?.bucketInfo.bucketName, false);

  const { status } = useStatus(
    generateGroupName(bucketData?.bucketInfo.bucketName || ''),
    bucketData?.bucketInfo.owner || '',
    address || '',
  );

  const openListModal = useCallback(() => {
    if (!bucketData) return;

    const initInfo = {
      bucket_name: bucketData.bucketInfo.bucketName,
      create_at: bucketData.bucketInfo.createAt.low,
    };
    modalData.modalDispatch({
      type: 'OPEN_LIST',
      initInfo,
    });
  }, [bucketData, modalData]);

  // auto open list modal
  useEffect(() => {
    const needOpenModal = p.get('openModal') as string;
    if (!needOpenModal) return;
    openListModal();
  }, [p, bucketData, openListModal]);

  if (!bucketData) {
    return <NoData />;
  }

  return (
    <>
      <ResourceInfo gap={20}>
        <ImgCon>
          <img src={defaultImg(bucketData.bucketInfo.bucketName, 246)} alt="" />
        </ImgCon>
        <Info
          gap={4}
          flexDirection={['column', 'column', 'column']}
          justifyContent={'space-around'}
        >
          <NameCon gap={4} alignItems={'center'} justifyContent={'flex-start'}>
            <Name>{bucketData.bucketInfo.bucketName}</Name>
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
            {/* {resourceType == '0' && (
              <FileSize> {parseFileSize(fileSize)} </FileSize>
            )}*/}
            Created by{' '}
            {address === bucketData.bucketInfo.owner ? (
              <span>You</span>
            ) : (
              <Link to={`/profile?address=${bucketData.bucketInfo.owner}`}>
                <span>{trimLongStr(bucketData.bucketInfo.owner)}</span>
              </Link>
            )}{' '}
            At {formatDateUTC(bucketData.bucketInfo.createAt.low * 1000)}
          </OwnCon>

          <ActionGroup gap={10} alignItems={'center'}>
            {/* {address === bucketData.bucketInfo.owner &&
              _.isEmpty(bucketItemInfo) && (
                <Button size={'sm'} onClick={openListModal}>
                  List
                </Button>
              )} */}

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

      <Box h={40} w={1000}></Box>
      <List
        status={status}
        name={bucketData.bucketInfo.bucketName}
        listed={false}
        bucketName={bucketData.bucketInfo.bucketName}
        bucketInfo={bucketData.bucketInfo}
      ></List>
    </>
  );
};

const ResourceInfo = styled(Flex)`
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
  width: 1200px;
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
