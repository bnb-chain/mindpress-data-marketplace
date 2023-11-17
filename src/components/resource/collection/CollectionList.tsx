import styled from '@emotion/styled';
import { CardPocketIcon, GoIcon } from '@totejs/icons';
import { Box, ColumnDef, Flex, Table } from '@totejs/uikit';
import { useCallback } from 'react';
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { useAccount } from 'wagmi';
import {
  useGetItemsByObjIds,
  usePurchaseQueryByObjIds,
} from '../../../hooks/useGetItemByObjId';
import { ITEM_RELATION_ADDR } from '../../../hooks/useGetItemRelationWithAddr';
import {
  OBJECT_ITEM,
  objListMergeListedAndPurchased,
  useGetObjectList,
} from '../../../hooks/useGetObjectList';
import { usePagination } from '../../../hooks/usePagination';
import { useSalesVolume } from '../../../hooks/useSalesVolume';
import {
  contentTypeToExtension,
  defaultImg,
  formatDateUTC,
  parseFileSize,
  trimLongStr,
} from '../../../utils';
import { getItemByObjectId } from '../../../utils/apis';
import { Item } from '../../../utils/apis/types';
import { QueryHeadBucketResponse } from '../../../utils/gfSDK';
import { Loader } from '../../Loader';
import { NoData } from '../../NoData';
import { PaginationSx } from '../../ui/table/PaginationSx';
import { TableProps } from '../../ui/table/TableProps';
import { ActionButtonGroup } from './ActionButtonGroup';

interface Props {
  itemInfo: Item;
  bucketData?: QueryHeadBucketResponse;
  relation: ITEM_RELATION_ADDR;
}
const CollectionList = (props: Props) => {
  const navigator = useNavigate();
  const { itemInfo, bucketData } = props;
  const [p] = useSearchParams();
  const id = p.get('id') as string;
  const path = p.get('path') as string;
  const { address } = useAccount();

  const {
    data: objectList,
    isLoading,
    refetch: reloadObjectList,
  } = useGetObjectList({
    bucketName: itemInfo?.name,
    path: path,
  });

  const oidList: number[] | undefined = objectList
    ?.filter((item) => item.type === 'file')
    .map((item: any) => {
      return item.data.Id as number;
    });

  const { data: objListedList, refetch: reloadListedList } =
    useGetItemsByObjIds(oidList || []);

  const { data: purchasedList, refetch: reloadPurchasedList } =
    usePurchaseQueryByObjIds(address, oidList || []);

  const reloadList = useCallback(() => {
    reloadObjectList();
    reloadListedList();
    reloadPurchasedList();
  }, [reloadListedList, reloadObjectList, reloadPurchasedList]);

  const mergedList = objListMergeListedAndPurchased(
    objectList,
    objListedList,
    purchasedList,
  );

  // console.log('oidList', oidList);
  // console.log('objListedList', objListedList);
  // console.log('purchasedList', purchasedList);
  // console.log('mergedList', mergedList);

  const { handlePageChange, page } = usePagination();

  const columns: ColumnDef<OBJECT_ITEM> = [
    {
      header: 'Data',
      width: '200px',
      cell: (data: any) => {
        const { type, name } = data;

        if (type === 'folder') {
          return (
            <ImgContainer
              cursor="pointer"
              onClick={() => {
                const params = {
                  id: id,
                  path: data.name + '/',
                };
                navigator({
                  pathname: '/resource',
                  search: `?${createSearchParams(params)}`,
                });
              }}
            >
              <IconCon alignItems={'center'} justifyContent={'center'}>
                <CardPocketIcon color={'white'} />
              </IconCon>
              <Box title={name}>{trimLongStr(name, 15)}</Box>
            </ImgContainer>
          );
        }

        if (type === 'file') {
          const { isListed } = data;
          const isOwner = data.data.Owner === address;

          return (
            <ImgContainer
              cursor={isListed || isOwner ? 'pointer' : 'inherit'}
              onClick={async () => {
                if (isListed) {
                  const item = await getItemByObjectId(data.data.Id);
                  navigator(`/resource?id=${item.id}`);
                  return;
                }

                if (!bucketData) return;
                if (isOwner) {
                  navigator(
                    `/detail?bid=${bucketData.bucketInfo.id}&oid=${data.data.Id}`,
                  );
                  return;
                }
              }}
            >
              <ImgCon src={defaultImg(name, 40)}></ImgCon>
              <Box title={name}>{trimLongStr(name, 15)}</Box>
            </ImgContainer>
          );
        }
      },
    },
    {
      header: 'Format',
      width: 160,
      cell: (data: any) => {
        const content_type =
          data.type === 'folder'
            ? 'Folder'
            : contentTypeToExtension(data?.data.ContentType);
        return <div>{content_type}</div>;
      },
    },
    {
      header: 'Size',
      width: 160,
      cell: (data: any) => {
        return (
          <div>
            {data.type === 'folder'
              ? '-'
              : parseFileSize(data.data.PayloadSize)}
          </div>
        );
      },
    },
    {
      header: 'Data Created',
      width: 120,
      cell: (data: any) => {
        return (
          <div>
            {data.type === 'folder'
              ? '-'
              : formatDateUTC(data.data.CreateAt * 1000)}
          </div>
        );
      },
    },
    // {
    //   header: 'Price',
    //   cell: (data: any) => {
    //     const { price } = data;
    //     const balance = divide10Exp(new BN(price, 10), 18);
    //     return <div>{Number(balance) ? `${balance} BNB` : '-'}</div>;
    //   },
    // },
    // {
    //   header: 'Total Vol',
    //   cell: (data: any) => {
    //     const { groupId } = data;
    //     return <TotalVol groupId={groupId}></TotalVol>;
    //   },
    // },
    {
      header: '',
      cell: (data) => {
        if (data.type === 'file') {
          return <ActionButtonGroup fileInfo={data} uploadFn={reloadList} />;
        }

        if (data.type === 'folder') {
          return (
            <GoIcon
              cursor={'pointer'}
              color={'#AEB4BC'}
              onClick={() => {
                const params = {
                  id: id,
                  path: data.name + '/',
                };
                navigator({
                  pathname: '/resource',
                  search: `?${createSearchParams(params)}`,
                });
              }}
            />
          );
        }
      },
    },
    // {
    //   header: 'Action',
    //   cell: (data: any) => {
    //     const { object_info, listed, groupId, name } = data;
    //       );
    //     const { owner, object_name, create_at } = object_info;
    //     return (
    //       <div>
    //         {owner === address && itemInfo.status !== 'LISTED' && (
    //           <Button
    //             size={'sm'}
    //             onClick={async () => {
    //               sessionStorage.setItem('resource_type', '1');
    //               if (!listed) {
    //                 modalData.modalDispatch({
    //                   type: 'OPEN_LIST',
    //                   initInfo: object_info,
    //                 });
    //               } else {
    //                 modalData.modalDispatch({
    //                   type: 'OPEN_DELIST',
    //                   delistData: {
    //                     groupId,
    //                     object_name,
    //                     create_at,
    //                     owner,
    //                   },
    //                 });
    //               }
    //             }}
    //           >
    //             {!listed ? 'List' : 'Delist'}
    //           </Button>
    //         )}
    //         {owner === address && itemInfo.status === 'LISTED' && (
    //           <GoIcon
    //             cursor={'pointer'}
    //             onClick={async () => {
    //               const list = state.globalState.breadList;
    //               const item = {
    //                 path: '/resource',
    //                 name: bucketData?.bucketInfo.bucketName || 'Collection',
    //                 query: p.toString(),
    //               };
    //               state.globalDispatch({
    //                 type: 'ADD_BREAD',
    //                 item,
    //               });

    //               const from = encodeURIComponent(
    //                 JSON.stringify(list.concat([item])),
    //               );

    //               const { id } = object_info;
    //               navigate(
    //                 `/resource?oid=${id}&bgn=${bgn}&address=${itemInfo.ownerAddress}&tab=dataList&from=${from}`,
    //               );
    //             }}
    //           ></GoIcon>
    //         )}
    //         {relation == 'PURCHASED' && owner !== address && (
    //           <OwnActionCom
    //             data={{
    //               ownerAddress: itemInfo.ownerAddress,
    //               type: 'Data',
    //               oid: object_info.id,
    //               bn: bucketData?.bucketInfo.bucketName,
    //               on: object_name,
    //             }}
    //           ></OwnActionCom>
    //         )}
    //       </div>
    //     );
    //   },
    // },
  ];

  // if (relation !== 'OWNER') {
  //   columns.splice(4, 6);
  // }

  if (!bucketData) {
    return <NoData />;
  }

  if (!objectList) {
    return <Loader />;
  }

  return (
    <Container>
      <Box h={10} />
      <Title as="h2" mb="30px">
        Data in this collection ({Math.min(20, objectList.length)})
      </Title>
      <Table
        // headerContent={`Latest ${Math.min(
        //   20,
        //   objectList.length,
        // )}  Data (Total of ${objectList.length})`}
        pagination={{
          current: page,
          pageSize: 20,
          total: objectList.length,
          onChange: handlePageChange,
          sx: PaginationSx,
        }}
        columns={columns}
        data={mergedList}
        loading={isLoading}
        {...TableProps}
      />
    </Container>
  );
};

export default CollectionList;

const Container = styled.div`
  background: #181a1e;
  /* padding: 4px 20px; */
  /* width: 1123px; */
`;

const ImgContainer = styled(Flex)`
  gap: 16px;
  color: #fff;
  font-size: 16px;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
`;

const ImgCon = styled.img`
  width: 40px;
  height: 40px;

  background: #d9d9d9;
  border-radius: 8px;
`;

const IconCon = styled(Flex)`
  width: 40px;
  height: 40px;
`;

const Title = styled(Box)`
  color: #fff;
  font-size: 24px;
`;
