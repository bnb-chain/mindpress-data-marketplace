import styled from '@emotion/styled';
import { Box, Flex, Table } from '@totejs/uikit';
import BN from 'bn.js';
import { MetaMaskAvatar } from 'react-metamask-avatar';
import { Link, useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useGetCatoriesMap } from '../../hooks/useGetCatoriesMap';
import { useGetListed } from '../../hooks/useGetListed';
import { useGlobal } from '../../hooks/useGlobal';
import { usePagination } from '../../hooks/usePagination';
import LinkArrow from '../../images/link_arrow.png';
import { defaultImg, divide10Exp, trimLongStr } from '../../utils';
import { CATEGORY_MAP } from '../../utils/category';
import { reportEvent } from '../../utils/ga';
import { ActionCom } from '../ActionCom';
import { CollectionLogo } from '../svgIcon/CollectionLogo';
import { TableProps } from '../ui/table/TableProps';

const AllList = () => {
  const { handlePageChange, page } = usePagination();
  const navigator = useNavigate();
  const { address } = useAccount();
  const { list, loading, total } = useGetListed(address, page, 10);
  const state = useGlobal();

  const categoryies = useGetCatoriesMap();

  const columns = [
    {
      header: '#',
      cell: (data: any, index: any) => {
        return <Box>{data.id}</Box>;
      },
      width: 80,
    },
    {
      header: 'Data/Collection',
      width: 200,
      cell: (data: any) => {
        const {
          name,
          url,
          id,
          metaData: { groupName },
          ownerAddress,
          type,
          categoryId,
        } = data;
        return (
          <ImgContainer
            alignItems={'center'}
            justifyContent={'flex-start'}
            gap={6}
            onClick={() => {
              reportEvent({ name: 'dm.main.list.item_name.click' });
              const item = {
                path: '/',
                name: 'Data MarketPlace',
                query: 'tab=trending',
              };
              state.globalDispatch({
                type: 'UPDATE_BREAD',
                index: 0,
                item,
              });

              navigator(
                `/resource?gid=${id}&gn=${groupName}&address=${ownerAddress}&from=${encodeURIComponent(
                  JSON.stringify([item]),
                )}`,
              );
            }}
          >
            <ImgCon src={url || defaultImg(name, 40)}></ImgCon>
            <Box title="collection">
              {trimLongStr(name, 15)}
              {type === 'Collection' && <CollectionLogo w={14} ml="4px" />}
            </Box>
          </ImgContainer>
        );
      },
    },
    {
      header: 'Category',
      width: 200,
      cell: (data: any) => {
        const { categoryId } = data;
        const categoryName = categoryies.data?.find(
          (c) => c.id === categoryId,
        )?.name;
        const category = CATEGORY_MAP[categoryId];
        return (
          <Flex
            display="inline-flex"
            background={category.bgColor}
            borderRadius={'40px'}
            padding="8px 12px"
            gap="8px"
            alignItems="center"
          >
            <Box w="16px" h="16px">
              {category.icon({
                boxSize: '16',
              })}
            </Box>
            <Box>{categoryName}</Box>
          </Flex>
        );
      },
    },
    {
      header: 'Price',
      width: 160,
      cell: (data: any) => {
        const { price } = data;
        const balance = divide10Exp(new BN(price, 10), 18);
        return <div>{balance} BNB</div>;
      },
    },
    // {
    //   header: 'Total Sales Vol',
    //   width: 160,
    //   cell: (data: any) => {
    //     const { listTime } = data;
    //     return <div>{listTime ? formatDateUTC(listTime * 1000) : '-'}</div>;
    //   },
    // },
    {
      header: 'Total Sales Vol',
      width: 120,
      cell: (data: any) => {
        const { totalSale } = data;
        return <div>{totalSale || 0}</div>;
      },
    },
    {
      header: 'Creator',
      width: 120,
      cell: (data: any) => {
        const { ownerAddress } = data;
        return (
          <MyLink to={`/profile?address=${ownerAddress}`}>
            <MetaMaskAvatar size={24} address={ownerAddress} />
            {trimLongStr(ownerAddress)}
          </MyLink>
        );
      },
    },
    {
      header: 'Action',
      cell: (data: any) => {
        return (
          <ActionCom
            data={data}
            address={address as string}
            from="home"
          ></ActionCom>
        );
      },
    },
  ];
  return (
    <Container>
      <Table
        headerContent={`Latest ${Math.min(
          20,
          list.length,
        )} Collections (Total of ${total})`}
        pagination={{
          current: page,
          pageSize: 10,
          total: total,
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

export default AllList;

const Container = styled(Box)`
  /* width: 1200px; */
  /* justify-content: center;
  align-items: center; */
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

const MyLink = styled(Link)`
  /* color: ${(props: any) => props.theme.colors.scene.primary.normal}; */
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  text-decoration: underline;

  &::after {
    content: '';
    width: 16px;
    height: 16px;
    display: inline-block;
  }

  &:hover {
    &::after {
      background: url(${LinkArrow}) no-repeat center center;
      background-size: contain;
    }
  }
`;
