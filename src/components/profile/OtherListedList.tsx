import styled from '@emotion/styled';
import { ColumnDef, Flex, Table } from '@totejs/uikit';
import BN from 'bn.js';
import { useNavigate } from 'react-router-dom';
import { usePagination } from '../../hooks/usePagination';
import {
  defaultImg,
  divide10Exp,
  formatDateUTC,
  trimLongStr,
} from '../../utils';
import { useGetItemList } from '../../hooks/useGetItemList';
import { ActionCom } from '../ActionCom';
import { Loader } from '../Loader';
import { CollectionLogo } from '../svgIcon/CollectionLogo';
import { TableProps } from '../ui/table/TableProps';
import { Item } from '../../utils/apis/types';
import { useAccount } from 'wagmi';

interface IOtherListedList {
  realAddress: string;
  self: boolean;
}

const OtherListedList = (props: IOtherListedList) => {
  const navigator = useNavigate();
  const { realAddress } = props;
  const { address } = useAccount();

  const { handlePageChange, page } = usePagination();
  const pageSize = 10;

  const { data: itemData, isLoading } = useGetItemList(
    {
      filter: {
        address: realAddress,
        keyword: '',
      },
      offset: (page - 1) * pageSize,
      limit: pageSize,
      sort: 'CREATION_DESC',
    },
    page,
    pageSize,
  );

  const columns: ColumnDef<Item> = [
    {
      header: 'Data',
      cell: (data) => {
        const { name, url, type, id, groupName, ownerAddress } = data;

        return (
          <ImgContainer
            alignItems={'center'}
            justifyContent={'flex-start'}
            gap={6}
            onClick={() => {
              navigator(
                `/resource?gid=${id}&gn=${groupName}&address=${ownerAddress}&tab=dataList&from=otherAddress`,
              );
            }}
          >
            <ImgCon src={url || defaultImg(name, 40)}></ImgCon>
            {trimLongStr(name, 15)}
            {type === 'COLLECTION' && (
              <CollectionLogo
                style={{ width: '10px', height: '10px' }}
              ></CollectionLogo>
            )}
          </ImgContainer>
        );
      },
    },
    {
      header: 'Type',
      cell: (data) => {
        const { type } = data;
        return <div>{type}</div>;
      },
    },
    {
      header: 'Price',
      width: 160,
      cell: (data) => {
        const { price } = data;
        const balance = divide10Exp(new BN(price, 10), 18);
        return <div>{balance} BNB</div>;
      },
    },
    {
      header: 'Data Listed',
      width: 160,
      cell: (data) => {
        const { createdAt } = data;
        return <div>{createdAt ? formatDateUTC(createdAt * 1000) : '-'}</div>;
      },
    },
    {
      header: 'Total Vol',
      width: 120,
      cell: (data) => {
        const { totalSale } = data;
        return <div>{totalSale || 0}</div>;
      },
    },
    {
      header: 'Action',
      cell: (data) => {
        return <ActionCom data={data} address={address as string}></ActionCom>;
      },
    },
  ];

  if (isLoading || !itemData) {
    return <Loader />;
  }

  return (
    <Container>
      <Table
        headerContent={`Latest ${Math.min(
          pageSize,
          itemData.total,
        )}  Collections (Total of ${itemData.total})`}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: itemData.total,
          onChange: handlePageChange,
        }}
        columns={columns}
        data={itemData.items}
        loading={isLoading}
        {...TableProps}
      />
    </Container>
  );
};

export default OtherListedList;

const Container = styled.div`
  width: 1123px;
  background: #181a1e;
  padding: 4px 20px;
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
