import styled from '@emotion/styled';
import { Box, Button, ColumnDef, Flex, Table } from '@totejs/uikit';
import { usePagination } from '../../../hooks/usePagination';
import { useAccount } from 'wagmi';
import {
  contentTypeToExtension,
  defaultImg,
  divide10Exp,
  formatDateUTC,
  generateGroupName,
  parseFileSize,
  trimLongStr,
} from '../../../utils';
import { useCollectionItems } from '../../../hooks/useCollectionItems';
import { useSalesVolume } from '../../../hooks/useSalesVolume';
import { useModal } from '../../../hooks/useModal';
import { BN } from 'bn.js';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGlobal } from '../../../hooks/useGlobal';
import { GoIcon, CardPocketIcon } from '@totejs/icons';
import { OwnActionCom } from '../../OwnActionCom';
import { TableProps } from '../../ui/table/TableProps';
import { Item } from '../../../utils/apis/types';
import { QueryHeadBucketResponse } from '../../../utils/gfSDK';
import { NoData } from '../../NoData';
import { ITEM_RELATION_ADDR } from '../../../hooks/useGetItemRelationWithAddr';
import { INode } from '../../../utils/tree';

interface Props {
  itemInfo: Item;
  bucketData?: QueryHeadBucketResponse;
  relation: ITEM_RELATION_ADDR;
}
const CollectionList = (props: Props) => {
  const { itemInfo, bucketData, relation } = props;

  console.log('list', itemInfo.status === 'LISTED');
  const { list, loading } = useCollectionItems(
    itemInfo.name,
    itemInfo.status === 'LISTED',
  );

  console.log('list', itemInfo.name, list);

  const { handlePageChange, page } = usePagination();

  const modalData = useModal();

  const { address } = useAccount();

  const navigate = useNavigate();
  const [p] = useSearchParams();

  const bgn = '';
  // if (bucketData.bucketInfo) {
  //   const bucketId = bucketData.bucketInfo.id;
  //   bgn = generateGroupName(bucketData.bucketInfo.bucketName);
  //

  const state = useGlobal();

  const navigator = useNavigate();

  const columns = [
    {
      header: 'Data',
      width: '200px',
      cell: (data: any) => {
        const { object_info, name } = data;
        const object_name =
          data._type === 'folder' ? data.name : data?.object_info?.object_name;

        return (
          <ImgContainer
            alignItems={'center'}
            justifyContent={'flex-start'}
            gap={6}
            onClick={() => {
              let list = state.globalState.breadList;
              console.log('list in from', list);
              if (
                list.slice(-1)[0].name !== bucketData?.bucketInfo.bucketName
              ) {
                const item = {
                  path: '/resource',
                  name: bucketData?.bucketInfo.bucketName || 'Collection',
                  query: p.toString(),
                };
                state.globalDispatch({
                  type: 'ADD_BREAD',
                  item,
                });
                list = list.concat([item]);
              }

              const from = encodeURIComponent(JSON.stringify(list));
              // console.log('obkect_info', object_info);
              if (!object_info) {
                // navigator(
                //   `/folder?bid=${
                //     bucketData?.bucketInfo.bucketId
                //   }&f=${encodeURIComponent(
                //     name,
                //   )}&address=${item}&from=${from}`,
                // );
              } else {
                const { id } = object_info;
                navigate(
                  `/resource?oid=${id}&bgn=${bgn}&address=${itemInfo.ownerAddress}&from=${from}`,
                );
              }
            }}
          >
            {data.children ? (
              <IconCon alignItems={'center'} justifyContent={'center'}>
                <CardPocketIcon color={'white'} />
              </IconCon>
            ) : (
              <ImgCon src={defaultImg(object_name, 40)}></ImgCon>
            )}
            {trimLongStr(object_name, 15)}
          </ImgContainer>
        );
      },
    },
    {
      header: 'Category',
      width: 160,
      cell: (data: any) => {
        const content_type =
          data._type === 'folder'
            ? 'Folder'
            : contentTypeToExtension(data?.object_info?.content_type);
        return <div>{content_type}</div>;
      },
    },
    {
      header: 'Size',
      width: 160,
      cell: (data: any) => {
        return (
          <div>
            {data._type === 'folder'
              ? '-'
              : parseFileSize(data?.object_info?.payload_size)}
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
            {data._type === 'folder'
              ? '-'
              : formatDateUTC(data?.object_info?.create_at * 1000)}
          </div>
        );
      },
    },
    {
      header: 'Price',
      cell: (data: any) => {
        const { price } = data;
        const balance = divide10Exp(new BN(price, 10), 18);
        return <div>{Number(balance) ? `${balance} BNB` : '-'}</div>;
      },
    },
    {
      header: 'Total Vol',
      cell: (data: any) => {
        const { groupId } = data;
        return <TotalVol groupId={groupId}></TotalVol>;
      },
    },
    {
      header: 'Action',
      cell: (data: any) => {
        const { object_info, listed, groupId, name } = data;
        if (!object_info)
          return (
            <GoIcon
              cursor={'pointer'}
              color={'#AEB4BC'}
              onClick={() => {
                const list = state.globalState.breadList;
                if (
                  list.slice(-1)[0].name !== bucketData?.bucketInfo.bucketName
                ) {
                  // const item = {
                  //   path: '/resource',
                  //   name: bucketData?.bucketInfo.bucketName,
                  //   query: p.toString(),
                  // };
                  // state.globalDispatch({
                  //   type: 'ADD_BREAD',
                  //   item,
                  // });
                  // list = list.concat([item]);
                }

                // const from = encodeURIComponent(JSON.stringify(list));

                // navigator(
                //   `/folder?bid=${bucketId}&f=${name}&address=${ownerAddress}&collectionListed=${collectionListed}&from=${from}`,
                // );
              }}
            />
          );
        const { owner, object_name, create_at } = object_info;
        return (
          <div>
            {owner === address && itemInfo.status !== 'LISTED' && (
              <Button
                size={'sm'}
                onClick={async () => {
                  sessionStorage.setItem('resource_type', '1');
                  if (!listed) {
                    modalData.modalDispatch({
                      type: 'OPEN_LIST',
                      initInfo: object_info,
                    });
                  } else {
                    modalData.modalDispatch({
                      type: 'OPEN_DELIST',
                      delistData: {
                        groupId,
                        object_name,
                        create_at,
                        owner,
                      },
                    });
                  }
                }}
              >
                {!listed ? 'List' : 'Delist'}
              </Button>
            )}
            {owner === address && itemInfo.status === 'LISTED' && (
              <GoIcon
                cursor={'pointer'}
                onClick={async () => {
                  const list = state.globalState.breadList;
                  const item = {
                    path: '/resource',
                    name: bucketData?.bucketInfo.bucketName || 'Collection',
                    query: p.toString(),
                  };
                  state.globalDispatch({
                    type: 'ADD_BREAD',
                    item,
                  });

                  const from = encodeURIComponent(
                    JSON.stringify(list.concat([item])),
                  );

                  const { id } = object_info;
                  navigate(
                    `/resource?oid=${id}&bgn=${bgn}&address=${itemInfo.ownerAddress}&tab=dataList&from=${from}`,
                  );
                }}
              ></GoIcon>
            )}
            {relation == 'PURCHASED' && owner !== address && (
              <OwnActionCom
                data={{
                  ownerAddress: itemInfo.ownerAddress,
                  type: 'Data',
                  oid: object_info.id,
                  bn: bucketData?.bucketInfo.bucketName,
                  on: object_name,
                }}
              ></OwnActionCom>
            )}
          </div>
        );
      },
    },
  ];
  // if (relation !== 'OWNER') {
  //   columns.splice(4, 6);
  // }

  if (!bucketData) {
    return <NoData />;
  }

  return (
    <Container>
      <Box h={10} />
      <Title as="h2" mb="30px">
        Data in this collection ({Math.min(20, list.length)})
      </Title>
      <Table
        headerContent={`Latest ${Math.min(20, list.length)}  Data (Total of ${
          list.length
        })`}
        pagination={{
          current: page,
          pageSize: 20,
          total: list.length,
          onChange: handlePageChange,
        }}
        columns={columns}
        data={list}
        loading={loading}
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
  cursor: pointer;
  color: ${(props: any) => props.theme.colors.scene.primary.normal};
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
