import styled from '@emotion/styled';
import { Box, ColumnDef, Flex, Pagination, Table } from '@totejs/uikit';
import BN from 'bn.js';
import { MetaMaskAvatar } from 'react-metamask-avatar';
import { Link, createSearchParams, useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useGetCatoriesMap } from '../../hooks/useGetCatoriesMap';
import { useGetItemList } from '../../hooks/useGetItemList';
import { useGlobal } from '../../hooks/useGlobal';
import { usePagination } from '../../hooks/usePagination';
import LinkArrow from '../../images/link_arrow.png';
import { defaultImg, divide10Exp, trimLongStr } from '../../utils';
import { CATEGORY_MAP } from '../../utils/category';
import { reportEvent } from '../../utils/ga';
import { ActionCom } from '../ActionCom';
import { CollectionLogo } from '../svgIcon/CollectionLogo';
import { TableProps } from '../ui/table/TableProps';
import { Loader } from '../Loader';
import { Item } from '../../utils/apis/types';
import { PaginationSx } from '../ui/table/PaginationSx';
import { GoIcon } from '@totejs/icons';

const PAGE_SIZE = 10;

const AllList = () => {
  const { handlePageChange, page } = usePagination();
  const navigator = useNavigate();
  const { address } = useAccount();
  const { data, isLoading, error } = useGetItemList(
    {
      filter: {
        address: '',
        keyword: '',
      },
      offset: (page - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      sort: 'CREATION_DESC',
    },
    page,
    PAGE_SIZE,
  );

  const state = useGlobal();
  const categoryies = useGetCatoriesMap();

  if (!data) return <Loader />;

  const list = data.items.map((item: any, index) => {
    item.rank = (page - 1) * PAGE_SIZE + index + 1;
    return item;
  });

  const columns: ColumnDef<Item> = [
    {
      header: '#',
      cell: (data: any) => {
        return <Box>{data.rank}</Box>;
      },
      width: 80,
    },
    {
      header: 'Data/Collection',
      width: 200,
      cell: (data) => {
        const { name, url, id, ownerAddress, type, groupName } = data;
        return (
          <ImgContainer
            alignItems={'center'}
            justifyContent={'flex-start'}
            gap={6}
            onClick={() => {
              reportEvent({ name: 'dm.main.list.item_name.click' });

              navigator(`/resource?id=${data.id}&path=/`);
            }}
          >
            <ImgCon src={url || defaultImg(name, 40)}></ImgCon>
            <Box title="collection">
              {trimLongStr(name, 15)}
              {type === 'COLLECTION' && <CollectionLogo w={14} ml="4px" />}
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
            color={category.color}
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
      cell: (data) => {
        const { type } = data;

        // if (type === 'OBJECT') {
        //   return (
        return (
          <ActionCom
            data={data}
            address={address as string}
            from="home"
          ></ActionCom>
        );
        //   );
        // }

        // if (type === 'COLLECTION') {
        //   return (
        //     <GoIcon
        //       cursor={'pointer'}
        //       color={'#AEB4BC'}
        //       onClick={() => {
        //         const params = {
        //           id: String(data.id),
        //           path: '/',
        //         };
        //         navigator({
        //           pathname: '/resource',
        //           search: `?${createSearchParams(params)}`,
        //         });
        //       }}
        //     />
        //   );
        // }
      },
    },
  ];

  if (!data || isLoading || error) {
    return <Loader />;
  }

  return (
    <Container>
      <Table
        pagination={{
          current: page,
          pageSize: 10,
          total: data.total,
          onChange: handlePageChange,
          sx: PaginationSx,
        }}
        columns={columns}
        data={list}
        loading={isLoading}
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
