import styled from '@emotion/styled';
import { Flex, Table } from '@totejs/uikit';
import BN from 'bn.js';
import { useAccount } from 'wagmi';
import { usePagination } from '../../hooks/usePagination';
import { useUserPurchased } from '../../hooks/useUserPurchased';
import {
  defaultImg,
  divide10Exp,
  formatDateUTC,
  trimLongStr,
} from '../../utils';
import { Link, useNavigate } from 'react-router-dom';
import { OwnActionCom } from '../OwnActionCom';
import { CollectionLogo } from '../svgIcon/CollectionLogo';
import { PaginationSx } from '../ui/table/PaginationSx';
import { TableProps } from '../ui/table/TableProps';

const PurchaseList = () => {
  const { handlePageChange, page } = usePagination();

  const pageSize = 10;
  const { list, loading, total } = useUserPurchased(page, pageSize);
  const { address } = useAccount();
  const navigator = useNavigate();

  const breadInfo = {
    name: 'My Purchase',
    path: '/profile',
  };
  const columns = [
    {
      header: 'Data',
      width: 200,
      cell: (data: any) => {
        const { id, url, type, name } = data;
        return (
          <ImgContainer
            alignItems={'center'}
            justifyContent={'flex-start'}
            gap={6}
            onClick={() => {
              navigator(`/resource?id=${id}`);
            }}
          >
            <ImgCon src={url || defaultImg(name, 40)}></ImgCon>
            {trimLongStr(data.name)}
            {type === 'Collection' && (
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
      cell: (data: any) => {
        const { type } = data;
        return <div>{type}</div>;
      },
    },
    {
      header: 'Current List Price',
      width: 160,
      cell: (data: any) => {
        const { price } = data;
        const balance = divide10Exp(new BN(price, 10), 18);
        return <div>{balance} BNB</div>;
      },
    },
    {
      header: 'Data Listed',
      width: 160,
      cell: (data: any) => {
        const { listTime } = data;
        return <div>{formatDateUTC(listTime * 1000)}</div>;
      },
    },
    {
      header: 'Total Vol',
      width: 120,
      cell: (data: any) => {
        const { totalVol } = data;
        return <div>{totalVol}</div>;
      },
    },
    {
      header: 'Creator',
      width: 120,
      cell: (data: any) => {
        const { ownerAddress } = data;
        return (
          <MyLink to={`/profile?address=${ownerAddress}`}>
            {trimLongStr(ownerAddress)}
          </MyLink>
        );
      },
    },
    {
      header: 'Action',
      cell: (data: any) => {
        return (
          <OwnActionCom
            data={data}
            address={address as string}
            breadInfo={breadInfo}
          ></OwnActionCom>
        );
      },
    },
  ];
  return (
    <Container>
      <Table
        headerContent={`Latest ${Math.min(
          pageSize,
          list.length,
        )}  Collections (Total of ${list.length})`}
        pagination={{
          current: page,
          pageSize: pageSize,
          total,
          onChange: handlePageChange,
          sx: PaginationSx,
        }}
        columns={columns}
        data={list}
        loading={loading}
        {...TableProps}
      />
    </Container>
  );
};

export default PurchaseList;

const Container = styled.div`
  /* width: 1123px; */
  background: #181a1e;
  padding: '4px 20px';
`;

const ImgContainer = styled(Flex)`
  cursor: pointer;
  /* color: ${(props: any) => props.theme.colors.scene.primary.normal}; */
  color: #ffe900;
`;

const ImgCon = styled.img`
  width: 40px;
  height: 40px;

  background: #d9d9d9;
  border-radius: 8px;
`;

const MyLink = styled(Link)`
  color: #ffe900;
`;
