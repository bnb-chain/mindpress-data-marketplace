import styled from '@emotion/styled';
import {
  Flex,
  Button,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@totejs/uikit';
import { NavBar } from '../components/NavBar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Overview from '../components/resource/Overview';
import CollectionList from '../components/resource/collection/CollectionList';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { EditModal } from '../components/modal/EditModal';
import { useAccount } from 'wagmi';
import { useResourceInfo } from '../hooks/useResourceInfo';
import { Loader } from '../components/Loader';
import { defaultImg, parseGroupName } from '../utils';
import { useSalesVolume } from '../hooks/useSalesVolume';
import { useStatus } from '../hooks/useStatus';
import { useModal } from '../hooks/useModal';
import { PenIcon, SendIcon } from '@totejs/icons';
import { useGlobal } from '../hooks/useGlobal';
import { useBNBPrice } from '../hooks/useBNBPrice';
import { NoData } from '../components/NoData';
import { DCELLAR_URL, GF_EXPLORER_URL } from '../env';
import { useWalletModal } from '../hooks/useWalletModal';
import { useCollectionItems } from '../hooks/useCollectionItems';
import { reportEvent } from '../utils/ga';
import BSCIcon from '../components/svgIcon/BSCIcon';
import { BscTraceIcon } from '../components/svgIcon/BscTraceIcon';
import { useItemStatus } from '../hooks/useItemStatus';
import { DataInfo } from '../components/resource/data/DataInfo';
import { SellIcon } from '../components/svgIcon/SellIcon';
import { CollectionInfo } from '../components/resource/collection/CollectionInfo';
import { useGetItemById } from '../hooks/useGetItemById';
import { useGetItemRelationWithAddr } from '../hooks/useGetItemRelationWithAddr';
import {
  useGetBOInfoFromGroup,
  useGetBucketById,
  useGetBucketByName,
  useGetGroup,
  useGetObject,
} from '../hooks/useGetBucketOrObj';
import { ImgCon } from '../components/resource/ImgCon';

const Resource = () => {
  const [p] = useSearchParams();
  // const groupId = p.getAll('gid')[0];
  // const cid = p.getAll('cid')[0];
  // const objectId = p.getAll('oid')[0];
  // const ownerAddress = p.getAll('address')[0];
  // const gName = p.getAll('gn')[0];
  // const bGroupName = p.getAll('bgn')[0];
  const itemId = p.getAll('id')[0];
  // const bucketId = p.getAll('bid')[0];

  const { address } = useAccount();

  const { data: itemInfo, isLoading: itemInfoLoading } = useGetItemById(
    parseInt(itemId),
  );

  // /* const { loading, baseInfo, noData } = useResourceInfo({
  //   groupId,
  //   bucketId,
  //   objectId,
  //   address: ownerAddress,
  //   groupName: gName,
  //   update,
  // });

  const relation = useGetItemRelationWithAddr(address, itemInfo);

  const storageInfo = useGetBOInfoFromGroup(itemInfo?.groupName);

  const { data: bucketData } = useGetBucketByName(storageInfo?.bucketName);

  const { data: objectData } = useGetObject(
    storageInfo?.bucketName,
    storageInfo?.objectName,
  );

  const { data: groupData } = useGetGroup(
    itemInfo?.groupName,
    itemInfo?.ownerAddress,
  );

  const resourceName = useMemo(() => {
    if (!storageInfo || !bucketData || !itemInfo) return;

    return storageInfo.type === 'COLLECTION'
      ? itemInfo?.name
      : `${bucketData.bucketInfo.bucketName} #${itemInfo?.name}`;
  }, [bucketData, itemInfo, storageInfo]);

  console.log('itemInfo', itemInfo);
  console.log('storageInfo', storageInfo);
  console.log('groupData', groupData);
  console.log('bucketData', bucketData);
  console.log('objectData', objectData);

  if (itemInfoLoading || !itemInfo) {
    return <Loader />;
  }

  // const [breadItems, setBreadItems] = useState([]);

  // const state = useGlobal();
  // const showBuy = useMemo(() => {
  //   const list = state.globalState.breadList;
  //   console.log('state.globalState.breadList', list);
  //   const fromPurchase =
  //     list.findIndex((item) => item.name == 'My Purchase') > -1;
  //   return (status == 1 || status == -1) && !fromPurchase;
  // }, [status, address, state.globalState.breadList]);

  /* useEffect(() => {
    const list = state.globalState.breadList;
    if (list.length && list[list.length - 1].name != title) {
      setBreadItems(
        list.concat([
          {
            name: title,
            query: '',
            path: '',
          },
        ]),
      );
    } else {
      setBreadItems(list);
    }
  }, [state.globalState.breadList, title]); */

  // const { num } = useCollectionItems(name, bucketListed);
  // console.log('breadItems -=---->', breadItems);

  return (
    <Container>
      {/* <MyBreadcrumb>
        {breadItems.map((item: any, index: number) => {
          return (
            <MyBreadcrumbItem
              key={index}
              isCurrentPage={index === breadItems.length - 1}
              onClick={() => {
                state.globalDispatch({
                  type: 'DEL_BREAD',
                  name: item.name,
                });
              }}
            >
              <BreadcrumbLink fontSize="16px" as="span">
                <Link
                  to={`${item.path}` + (item.query ? '?' + item.query : '')}
                >
                  {item?.name?.replace('+', ' ')}
                </Link>
              </BreadcrumbLink>
            </MyBreadcrumbItem>
          );
        })}
      </MyBreadcrumb> */}

      <ResourceInfo gap={100} padding="30px 0">
        <ImgCon relation={relation} itemInfo={itemInfo} />

        <Info flexDirection="column" flex="1">
          <NameCon gap={4} alignItems={'center'} justifyContent={'flex-start'}>
            <Name>{resourceName}</Name>
            <BscTraceIcon
              color="#53EAA1"
              width={24}
              height={20}
              cursor={'pointer'}
              marginLeft={6}
              onClick={() => {
                if (!storageInfo) return;
                const o =
                  itemInfo?.type == 'COLLECTION'
                    ? bucketData?.bucketInfo
                    : objectData?.objectInfo;

                reportEvent({
                  name: 'dm.detail.overview.view_in_explorer.click',
                });
                window.open(
                  `${GF_EXPLORER_URL}${
                    itemInfo?.type == 'COLLECTION' ? 'bucket' : 'object'
                  }/0x${Number(o?.id).toString(16).padStart(64, '0')}`,
                );
              }}
            />
          </NameCon>

          {itemInfo?.type === 'OBJECT' && (
            <DataInfo itemInfo={itemInfo} objectData={objectData} />
          )}

          {itemInfo?.type == 'COLLECTION' && (
            <CollectionInfo itemInfo={itemInfo} relation={relation} />
          )}
        </Info>
      </ResourceInfo>

      <Hr mb="55px" />

      <Overview
        itemInfo={itemInfo}
        relation={relation}
        bucketData={bucketData}
        groupData={groupData}
      />

      {itemInfo?.type === 'COLLECTION' && (
        <>
          <Hr mt="55px" />
          <Box mt="50px">
            <CollectionList
              itemInfo={itemInfo}
              bucketData={bucketData}
              relation={relation}
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default Resource;

const Container = styled(Box)`
  margin-top: 20px;
  width: 1400px;
  background-color: #181a1e;
  border-radius: 16px;
  border: 1px solid #1e2026;
  padding: 80px 100px;
`;

const ResourceInfo = styled(Flex)``;

const Hr = styled(Box)`
  height: 1px;
  background-color: #373943;
`;

const MyBreadcrumb = styled(Breadcrumb)`
  /* background: #373943; */
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;

  color: #ffffff;
`;

const MyBreadcrumbItem = styled(BreadcrumbItem)``;

const Info = styled(Flex)`
  padding-top: 50px;
  padding-bottom: 50px;
`;

const NameCon = styled(Flex)``;

const Name = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 38px;
  /* identical to box height, or 119% */

  color: #f7f7f8;
`;
