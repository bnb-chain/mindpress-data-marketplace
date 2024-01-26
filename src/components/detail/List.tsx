import styled from '@emotion/styled';
import { CardPocketIcon, GoIcon } from '@totejs/icons';
import { Box, Flex, Table } from '@totejs/uikit';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useCollectionItems } from '../../hooks/useCollectionItems';
import { useGlobal } from '../../hooks/useGlobal';
import { useModal } from '../../hooks/useModal';
import { usePagination } from '../../hooks/usePagination';
import {
  contentTypeToExtension,
  defaultImg,
  formatDateUTC,
  generateGroupName,
  parseFileSize,
  trimLongStr,
} from '../../utils';
import { OwnActionCom } from '../OwnActionCom';
import { YellowButton } from '../ui/buttons/YellowButton';
import { PaginationSx } from '../ui/table/PaginationSx';

const List = (props: any) => {
  const {
    name,
    bucketName,
    listed: collectionListed,
    status: bucketStatus,
    bucketInfo,
  } = props;

  const { list, loading, toUpdate } = useCollectionItems(
    name,
    collectionListed,
  );

  const { handlePageChange, page } = usePagination();

  const modalData = useModal();

  const { address } = useAccount();

  const [p] = useSearchParams();
  let bucketId = p.getAll('bid')[0];
  const ownerAddress = p.getAll('address')[0];

  let bgn = '';
  if (!bucketId && bucketInfo) {
    bucketId = bucketInfo.id;
    bgn = generateGroupName(bucketInfo.bucketName);
  }
  const state = useGlobal();

  const navigator = useNavigate();

  const columns = [
    {
      header: 'Data',
      width: '200px',
      cell: (data: any) => {
        const { object_info } = data;
        const object_name =
          data._type === 'folder' ? data.name : data?.object_info?.object_name;

        return (
          <ImgContainer
            alignItems={'center'}
            justifyContent={'flex-start'}
            gap={6}
            onClick={() => {
              const { id } = object_info;
              navigator(`/detail?bid=${bucketId}&oid=${id}`);
            }}
          >
            {data.children ? (
              <IconCon alignItems={'center'} justifyContent={'center'}>
                <CardPocketIcon color={'white'} />
              </IconCon>
            ) : (
              <ImgCon src={defaultImg(object_name, 40)}></ImgCon>
            )}
            <Box as="span" color="#FFE900" fontWeight={700}>
              {trimLongStr(object_name, 15)}
            </Box>
          </ImgContainer>
        );
      },
    },
    {
      header: 'Type',
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
      header: 'Action',
      cell: (data: any) => {
        const { object_info, listed, groupId, name } = data;
        if (!object_info)
          return (
            <GoIcon
              cursor={'pointer'}
              color={'#AEB4BC'}
              onClick={() => {
                let list = state.globalState.breadList;
                if (list.slice(-1)[0].name !== bucketName) {
                  const item = {
                    path: '/resource',
                    name: bucketName,
                    query: p.toString(),
                  };
                  state.globalDispatch({
                    type: 'ADD_BREAD',
                    item,
                  });
                  list = list.concat([item]);
                }

                const from = encodeURIComponent(JSON.stringify(list));

                navigator(
                  `/folder?bid=${bucketId}&f=${name}&address=${ownerAddress}&collectionListed=${collectionListed}&from=${from}`,
                );
              }}
            />
          );
        const { owner, object_name, create_at } = object_info;
        return (
          <div>
            {owner === address && !collectionListed && (
              <YellowButton
                size={'sm'}
                onClick={async () => {
                  sessionStorage.setItem('resource_type', '1');
                  if (!listed) {
                    // console.log('object_info', object_info);
                    modalData.modalDispatch({
                      type: 'OPEN_LIST',
                      initInfo: object_info,
                      callBack: () => {
                        toUpdate();
                      },
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
                      callBack: () => {
                        toUpdate();
                      },
                    });
                  }
                }}
              >
                {!listed ? 'List' : 'Delist'}
              </YellowButton>
            )}
            {owner === address && collectionListed && (
              <GoIcon
                cursor={'pointer'}
                onClick={async () => {
                  const list = state.globalState.breadList;
                  const item = {
                    path: '/resource',
                    name: bucketName || 'Collection',
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
                  navigator(
                    `/resource?oid=${id}&bgn=${bgn}&address=${ownerAddress}&tab=dataList&from=${from}`,
                  );
                }}
              ></GoIcon>
            )}
            {bucketStatus == 2 && owner !== address && (
              <OwnActionCom
                data={{
                  ownerAddress,
                  type: 'Data',
                  oid: object_info.id,
                  bn: bucketName,
                  on: object_name,
                }}
              ></OwnActionCom>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <Container>
      <Box h={10} />
      <Table
        headerContent={`Latest ${Math.min(20, list.length)}  Data (Total of ${
          list.length
        })`}
        containerStyle={{ padding: 20 }}
        pagination={{
          current: page,
          pageSize: 20,
          total: list.length,
          onChange: handlePageChange,
          sx: PaginationSx,
        }}
        columns={columns}
        data={list}
        loading={loading}
        hoverBg={'#14151A'}
      />
    </Container>
  );
};

export default List;

const Container = styled.div`
  width: 996px;
  margin-left: auto;
  margin-right: auto;
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
