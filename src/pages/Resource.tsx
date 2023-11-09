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
import { defaultImg } from '../utils';
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

const Resource = () => {
  const [p] = useSearchParams();

  const groupId = p.getAll('gid')[0];
  const bucketId = p.getAll('bid')[0];
  const cid = p.getAll('cid')[0];
  const objectId = p.getAll('oid')[0];
  const ownerAddress = p.getAll('address')[0];
  const gName = p.getAll('gn')[0];
  const bGroupName = p.getAll('bgn')[0];

  const [open, setOpen] = useState(false);

  const { address, isConnected, isConnecting } = useAccount();

  const [update, setUpdate] = useState(false);

  const { loading, baseInfo, noData } = useResourceInfo({
    groupId,
    bucketId,
    objectId,
    address: ownerAddress,
    groupName: gName,
    update,
  });
  const {
    name,
    price,
    url,
    desc,
    listed,
    type,
    bucketName,
    objectInfo,
    bucketInfo,
    bucketListed,
  } = baseInfo;

  console.log('baseInfo', baseInfo);

  const { salesVolume } = useSalesVolume(groupId);
  const { status } = useStatus(
    bGroupName || gName,
    ownerAddress,
    address as string,
  );

  const [showEdit, setShowEdit] = useState(false);

  const [breadItems, setBreadItems] = useState<any>([]);

  const state = useGlobal();
  // const showBuy = useMemo(() => {
  //   const list = state.globalState.breadList;
  //   console.log('state.globalState.breadList', list);
  //   const fromPurchase =
  //     list.findIndex((item) => item.name == 'My Purchase') > -1;
  //   return (status == 1 || status == -1) && !fromPurchase;
  // }, [status, address, state.globalState.breadList]);

  // const showDcellarBut = useMemo(() => {
  //   return status > -1;
  // }, [status, address]);

  const resourceType = useMemo(() => {
    return objectId || type === 'Data' ? '0' : '1';
  }, [objectId, type]);

  const title = useMemo(() => {
    return bucketName === name ? name : `${bucketName} #${name}`;
  }, [name, bucketName]);

  useEffect(() => {
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
  }, [state.globalState.breadList, title]);

  const isOwner = useMemo(() => {
    return address === ownerAddress;
  }, [address, ownerAddress]);

  const showEndPoint = useMemo(() => {
    return isOwner || (address !== ownerAddress && status === 2);
  }, [isOwner, address, ownerAddress, status]);

  const hasOwn = useMemo(() => {
    return isOwner || status === 2;
  }, [isOwner, status]);

  // 0: data
  // 1: collection
  // console.log('resourchasOwneType', resourceType);
  // console.log('isOwner', isOwner);
  // // hasOwn: true = had bought
  // console.log('hasOwn', hasOwn);
  // console.log('listed', listed);

  const itemStatus = useItemStatus(isOwner, hasOwn);
  // console.log('itemStatus', itemStatus);

  const CreateTime = useMemo(() => {
    let obj;
    if (resourceType === '0') {
      obj = objectInfo;
    } else {
      obj = bucketInfo;
    }
    return obj?.createAt?.low || 0;
  }, [bucketInfo, objectInfo]);

  const fileSize = useMemo(() => {
    return objectInfo?.payloadSize?.low;
  }, [objectInfo]);

  const { num } = useCollectionItems(name, bucketListed);
  if (loading) return <Loader></Loader>;
  if (noData) {
    return (
      <NoDataCon
        alignItems={'center'}
        justifyContent={'center'}
        flexDirection={'column'}
      >
        <NoData size={280}></NoData>
        <NoDataTitle>No Data</NoDataTitle>
        <NoDataSub>No data available</NoDataSub>
      </NoDataCon>
    );
  }

  console.log('breadItems -=---->', breadItems);

  return (
    <Container>
      <MyBreadcrumb>
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
      </MyBreadcrumb>

      <ResourceInfo gap={100} padding="30px 0">
        <ImgCon>
          <img src={url || defaultImg(name, 246)} alt="" />
          {itemStatus !== 'NOT_PURCHASED_BY_ME' && (
            <Cover alignItems={'center'} justifyContent="flex-end" p="16px">
              {itemStatus === 'PURCHASED_BY_ME' && (
                <Flex
                  alignItems="center"
                  gap="8px"
                  color="#181A1E"
                  bg="#53EAA1"
                  borderRadius="40px"
                  p="8px 12px"
                  fontSize="16px"
                  fontWeight={600}
                >
                  <SellIcon w={24} color="#181A1E" /> PURCHASED
                </Flex>
              )}

              {itemStatus === 'LISTED_BY_ME' && (
                <Flex
                  alignItems="center"
                  gap="8px"
                  color="#181A1E"
                  bg="#F1F2F3"
                  borderRadius="40px"
                  p="8px 12px"
                  fontSize="16px"
                  fontWeight={600}
                  cursor="pointer"
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  <PenIcon w={24} color="#181A1E" /> Edit
                </Flex>
              )}
            </Cover>
          )}
        </ImgCon>

        <Info flexDirection="column" flex="1">
          <NameCon gap={4} alignItems={'center'} justifyContent={'flex-start'}>
            <Name>{title}</Name>
            <BscTraceIcon
              color="#53EAA1"
              width={24}
              height={20}
              cursor={'pointer'}
              marginLeft={6}
              onClick={() => {
                const o = resourceType == '1' ? bucketInfo : objectInfo;
                const { id } = o;
                reportEvent({
                  name: 'dm.detail.overview.view_in_explorer.click',
                });
                window.open(
                  `${GF_EXPLORER_URL}${
                    resourceType == '1' ? 'bucket' : 'object'
                  }/0x${Number(id).toString(16).padStart(64, '0')}`,
                );
              }}
            />
          </NameCon>

          {resourceType === '0' && (
            <DataInfo
              collection={{
                path: breadItems[1].path,
                name: breadItems[1].name,
                query: breadItems[1].query,
              }}
              baseInfo={baseInfo}
              listed={listed}
              createdAt={CreateTime}
              fileSize={fileSize}
              salesVolume={salesVolume}
              itemStatus={itemStatus}
              ownerAddress={ownerAddress}
              categoryId={parseInt(cid)}
              price={price}
            />
          )}

          {resourceType == '1' && (
            <CollectionInfo
              collection={{
                path: breadItems[1].path,
                name: breadItems[1].name,
                query: breadItems[1].query,
              }}
              name={name}
              baseInfo={baseInfo}
              listed={listed}
              createdAt={CreateTime}
              fileSize={fileSize}
              salesVolume={salesVolume}
              itemStatus={itemStatus}
              ownerAddress={ownerAddress}
              categoryId={parseInt(cid)}
              price={price}
            />
          )}

          {/* 
          {resourceType == '1' && (
            <CollInfo gap={8}>
              <ItemNum>{num} Items</ItemNum>
              <Tag alignItems={'center'} justifyContent={'center'}>
                Collection
              </Tag>
            </CollInfo>
          )}

          <OwnCon alignItems={'center'}>
            {resourceType == '0' && (
              <FileSize> {parseFileSize(fileSize)} </FileSize>
            )}
            Created by{' '}
            {address === ownerAddress ? (
              <span>You</span>
            ) : (
              <Link to={`/profile?address=${ownerAddress}`}>
                <span>{trimLongStr(ownerAddress)}</span>
              </Link>
            )}{' '}
            At {formatDateUTC(CreateTime * 1000)}
          </OwnCon>

          <ActionGroup gap={10} alignItems={'center'}>
            {address === ownerAddress && !listed && !bucketListed && (
              <Button
                size={'sm'}
                onClick={async () => {
                  reportEvent({ name: 'dm.detail.overview.list.click' });
                  const initInfo = {
                    bucket_name: bucketName,
                    object_name: bucketName === name ? '' : name,
                    create_at: CreateTime,
                    payload_size: fileSize,
                  };
                  modalData.modalDispatch({
                    type: 'OPEN_LIST',
                    initInfo,
                  });
                }}
              >
                List
              </Button>
            )}
            {showBuy && (
              <Button
                size={'sm'}
                onClick={() => {
                  reportEvent({ name: 'dm.detail.overview.buy.click' });
                  if (!isConnected && !isConnecting) {
                    handleModalOpen();
                  } else {
                    modalData.modalDispatch({
                      type: 'OPEN_BUY',
                      buyData: baseInfo,
                    });
                  }
                }}
              >
                Buy
              </Button>
            )}
            {showDcellarBut && (
              <Button
                size={'sm'}
                onClick={() => {
                  reportEvent({
                    name: 'dm.detail.overview.view_in_dcellar.click',
                  });
                  window.open(`${DCELLAR_URL}buckets/${bucketName}`);
                }}
                variant="ghost"
              >
                View in Dcellar
              </Button>
            )}
          </ActionGroup> */}
        </Info>
      </ResourceInfo>

      <Hr mb="55px" />

      <Overview
        resourceType={resourceType}
        desc={desc}
        showEdit={address === ownerAddress}
        editFun={() => {
          setOpen(true);
        }}
        name={name}
        bucketName={bucketName}
        listed={listed}
        showEndpoints={showEndPoint}
        itemStatus={itemStatus}
        baseInfo={baseInfo}
      />

      {resourceType === '1' && (
        <>
          <Hr mt="55px" />
          <Box mt="50px">
            <CollectionList
              status={status}
              name={name}
              listed={bucketListed}
              bucketName={bucketName}
              bucketInfo={bucketInfo}
              hasOwn={hasOwn}
            />
          </Box>
        </>
      )}

      {/* <Box h={30}></Box> */}
      {/* <NavBar active={currentTab} onChange={handleTabChange} items={navItems} />
      <Box h={10} w={996}></Box> */}
      {/* {currentTab === Type.Description ? (
        <Overview
          desc={desc}
          showEdit={address === ownerAddress}
          editFun={() => {
            setOpen(true);
          }}
          name={name}
          bucketName={bucketName}
          listed={listed}
          showEndpoints={showEndPoint}
        ></Overview>
      ) : (
        <List
          status={status}
          name={name}
          listed={bucketListed}
          bucketName={bucketName}
          bucketInfo={bucketInfo}
          hasOwn={hasOwn}
        ></List>
      )} */}
      {open && (
        <EditModal
          isOpen={open}
          handleOpen={() => {
            reportEvent({ name: 'dm.detail.overview.edit.click' });
            setOpen(false);
          }}
          detail={{
            ...baseInfo,
            desc,
            url,
          }}
          updateFn={() => {
            setUpdate(true);
          }}
        ></EditModal>
      )}
    </Container>
  );
};

export default Resource;

const Container = styled.div`
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

const ImgCon = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;

  img {
    object-fit: cover;
    width: 500px;
    height: 500px;

    background-color: #d9d9d9;
    border-radius: 8px;
  }
`;

const Cover = styled(Flex)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  background: linear-gradient(
    180deg,
    rgba(24, 26, 30, 0.8) 0%,
    rgba(25, 27, 31, 0) 100%
  );
`;

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

const NoDataCon = styled(Flex)``;

const NoDataTitle = styled.div`
  font-size: 32px;
  font-weight: 600;
`;

const NoDataSub = styled.div`
  font-size: 20px;
`;
