import styled from '@emotion/styled';
import { CardPocketIcon } from '@totejs/icons';
import { Box, ColumnDef, Flex, Table } from '@totejs/uikit';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { useAccount } from 'wagmi';
import { DEFAULT_ITEM } from '../../../hooks/useGetItemById';
import {
  useGetItemByObjId,
  useGetItemsByObjIds,
} from '../../../hooks/useGetItemByObjId';
import { ITEM_RELATION_ADDR } from '../../../hooks/useGetItemRelationWithAddr';
import { OBJECT_ITEM, useGetObjectList } from '../../../hooks/useGetObjectList';
import { useGlobal } from '../../../hooks/useGlobal';
import { useModal } from '../../../hooks/useModal';
import { usePagination } from '../../../hooks/usePagination';
import { useSalesVolume } from '../../../hooks/useSalesVolume';
import {
  contentTypeToExtension,
  defaultImg,
  formatDateUTC,
  generateGroupName,
  parseFileSize,
  trimLongStr,
} from '../../../utils';
import { Item } from '../../../utils/apis/types';
import { QueryHeadBucketResponse } from '../../../utils/gfSDK';
import { Loader } from '../../Loader';
import { NoData } from '../../NoData';
import { TableProps } from '../../ui/table/TableProps';

interface Props {
  itemInfo: Item;
  bucketData?: QueryHeadBucketResponse;
  relation: ITEM_RELATION_ADDR;
}
const CollectionList = (props: Props) => {
  const state = useGlobal();
  const navigator = useNavigate();
  const { itemInfo, bucketData, relation } = props;
  const [p] = useSearchParams();
  const id = p.get('id') as string;
  const path = p.get('path') as string;

  const { data: objectList, isLoading } = useGetObjectList({
    bucketName: itemInfo?.name,
    path: path,
  });

  console.log('objectList', objectList);

  const oidList: string[] | undefined = objectList
    ?.filter((item) => item.type === 'file')
    .map((item: any) => {
      console.log('item', item);
      return item.data.Id as string;
      // return {
      //   id: item.data.Id,
      //   name: generateGroupName(itemInfo.name, item.name),
      // };
    });
  // console.log('oidList', oidList);

  // const xx = useGetItemsByObjIds(oidList || []);
  // console.log('xx', xx[0]);

  // const { list, loading } = useCollectionItems(
  //   itemInfo.name,
  //   itemInfo.status === 'LISTED',
  // );

  // console.log('list', list);

  const [selectObjectId, setSelectObjectId] = useState('');
  const [selectBucketName, setBucketName] = useState('');
  const { data: selectItem } = useGetItemByObjId(selectObjectId);

  // TODO: if selectItem is null, the object is not listed, should go to bid or oid page
  // console.log('selectItem', selectObjectId, selectItem);
  useEffect(() => {
    if (selectItem?.id === DEFAULT_ITEM.id) return;

    // console.log('selectItem', selectItem);
    if (!_.isEmpty(selectItem)) {
      console.log(`/resource?id=${selectItem.id}`);
      navigator(`/resource?id=${selectItem.id}`);
    } else {
      // this item had not been listed yet
      // only listed item can enter resource page
      // return;
      // console.log(`/resource?oid=${selectObjectId}`);
      // navigator(`/detail?bn=${selectBucketName}`);
    }
  });

  const { handlePageChange, page } = usePagination();

  const modalData = useModal();

  const { address } = useAccount();

  const navigate = useNavigate();

  const bgn = '';
  // if (bucketData.bucketInfo) {
  //   const bucketId = bucketData.bucketInfo.id;
  //   bgn = generateGroupName(bucketData.bucketInfo.bucketName);
  //

  // const { data: bucketIdData, refetch } = useGetBucketById(bucketId);

  const columns: ColumnDef<OBJECT_ITEM> = [
    {
      header: 'Data',
      width: '200px',
      cell: (data: any) => {
        const { type, name } = data;
        return (
          <ImgContainer
            alignItems={'center'}
            justifyContent={'flex-start'}
            gap={6}
            onClick={() => {
              // let list = state.globalState.breadList;
              // console.log('list in from', list);
              // if (
              //   list.slice(-1)[0].name !== bucketData?.bucketInfo.bucketName
              // ) {
              //   const item = {
              //     path: '/resource',
              //     name: bucketData?.bucketInfo.bucketName || 'Collection',
              //     query: p.toString(),
              //   };
              //   state.globalDispatch({
              //     type: 'ADD_BREAD',
              //     item,
              //   });
              //   list = list.concat([item]);
              // }

              // const from = encodeURIComponent(JSON.stringify(list));

              if (type === 'folder') {
                // console.log(data.name);
                const params = {
                  id: id,
                  path: data.name + '/',
                };
                navigator({
                  pathname: '/resource',
                  search: `?${createSearchParams(params)}`,
                });
                // `/resourceid=${
                //   bucketData?.bucketInfo.bucketId
                // }&f=${encodeURIComponent(name)}&address=${item}&from=${from}`,
                // navigator(
                //   `/folder?bid=${
                //     bucketData?.bucketInfo.bucketId
                //   }&f=${encodeURIComponent(
                //     name,
                //   )}&address=${item}&from=${from}`,
                // );
              } else {
                // console.log('data', data);
                const id = String(data.data.Id);
                setSelectObjectId(id);
                setBucketName(data.data.BucketName);
                // navigate(
                //   `/resource?oid=${id}&bgn=${bgn}&address=${itemInfo.ownerAddress}&from=${from}`,
                // );
              }
            }}
          >
            {type === 'folder' ? (
              <IconCon alignItems={'center'} justifyContent={'center'}>
                <CardPocketIcon color={'white'} />
              </IconCon>
            ) : (
              <ImgCon src={defaultImg(name, 40)}></ImgCon>
            )}
            <Box title={name}>{trimLongStr(name, 15)}</Box>
          </ImgContainer>
        );
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
        return <Box>{}</Box>;
      },
    },
    // {
    //   header: 'Action',
    //   cell: (data: any) => {
    //     const { object_info, listed, groupId, name } = data;
    //     if (!object_info)
    //       return (
    //         <GoIcon
    //           cursor={'pointer'}
    //           color={'#AEB4BC'}
    //           onClick={() => {
    //             const list = state.globalState.breadList;
    //             if (
    //               list.slice(-1)[0].name !== bucketData?.bucketInfo.bucketName
    //             ) {
    //               // const item = {
    //               //   path: '/resource',
    //               //   name: bucketData?.bucketInfo.bucketName,
    //               //   query: p.toString(),
    //               // };
    //               // state.globalDispatch({
    //               //   type: 'ADD_BREAD',
    //               //   item,
    //               // });
    //               // list = list.concat([item]);
    //             }

    //             // const from = encodeURIComponent(JSON.stringify(list));

    //             // navigator(
    //             //   `/folder?bid=${bucketId}&f=${name}&address=${ownerAddress}&collectionListed=${collectionListed}&from=${from}`,
    //             // );
    //           }}
    //         />
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
        headerContent={`Latest ${Math.min(
          20,
          objectList.length,
        )}  Data (Total of ${objectList.length})`}
        pagination={{
          current: page,
          pageSize: 20,
          total: objectList.length,
          onChange: handlePageChange,
        }}
        columns={columns}
        data={objectList}
        loading={isLoading}
        {...TableProps}
      />
    </Container>
  );
};

export default CollectionList;

const Container = styled.div`
  background: #181a1e;
  padding: 4px 20px;
  /* width: 1123px; */
`;

const ImgContainer = styled(Flex)`
  gap: 16px;
  cursor: pointer;
  color: #fff;
  font-size: 16px;
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

const TotalVol = (props: any) => {
  const { groupId } = props;
  const { salesVolume } = useSalesVolume(groupId);
  return <div>{Number(salesVolume) || '-'}</div>;
};
