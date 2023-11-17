import styled from '@emotion/styled';
import { Button, Flex, Table } from '@totejs/uikit';
import { useNavigate } from 'react-router-dom';
import { useAccount, useSwitchNetwork } from 'wagmi';
import { GF_CHAIN_ID } from '../../env';
import { usePagination } from '../../hooks/usePagination';
import {
  defaultImg,
  divide10Exp,
  formatDateUTC,
  trimLongStr,
} from '../../utils';

import { useCollectionList } from '../../hooks/useCollectionList';
import { useModal } from '../../hooks/useModal';
// import { useSalesVolume } from '../../hooks/useSalesVolume';
import { BN } from 'bn.js';
import { Dispatch, useMemo } from 'react';
import { useListedStatus } from '../../hooks/useListedStatus';
import { reportEvent } from '../../utils/ga';
import { PaginationSx } from '../ui/table/PaginationSx';
import { TableProps } from '../ui/table/TableProps';
import CollNoData from './CollNoData';

const PriceCon = (props: { groupId: string }) => {
  const { groupId } = props;
  const { price } = useListedStatus(groupId);

  let balance = '-';
  if (price) {
    balance = divide10Exp(new BN(price, 10), 18) + ' BNB';
  }
  return <div>{balance}</div>;
};

interface ICollectionList {
  setShowButton: Dispatch<boolean>;
}
const MyCollectionList = (props: ICollectionList) => {
  const pageSize = 10;

  const { handlePageChange, page } = usePagination();
  const { setShowButton } = props;
  const modalData = useModal();
  // const { list, loading, total } = useCollectionList(page, pageSize, modalData.modalState.result);
  const { list, loading, total } = useCollectionList(
    page,
    pageSize,
    modalData.modalState.result,
  );
  const { switchNetwork } = useSwitchNetwork();
  const navigator = useNavigate();

  const showNoData = useMemo(() => {
    const show = !loading && !list.length;
    setShowButton(!show);
    return show;
  }, [loading, list.length, setShowButton]);

  const columns = [
    {
      header: 'Data Collection',
      cell: (data: any) => {
        const {
          bucket_info: { bucket_name, id: bucketId },
        } = data;
        return (
          <ImgContainer
            alignItems={'center'}
            justifyContent={'flex-start'}
            gap={6}
            onClick={async () => {
              navigator(`/detail?bid=${bucketId}`);
            }}
          >
            <ImgCon src={defaultImg(bucket_name, 40)}></ImgCon>
            {trimLongStr(bucket_name, 15)}
          </ImgContainer>
        );
      },
    },
    {
      header: 'Data Created',
      width: 160,
      cell: (data: any) => {
        const {
          bucket_info: { create_at },
        } = data;
        return <div>{formatDateUTC(create_at * 1000)}</div>;
      },
    },
    {
      header: 'Price',
      width: 160,
      cell: (data: any) => {
        const { groupId } = data;
        return <PriceCon groupId={groupId}></PriceCon>;
      },
    },
    {
      header: 'Total Vol',
      width: 120,
      cell: (data: any) => {
        const { totalVol } = data;
        return <div>{totalVol || 0}</div>;
      },
    },
    {
      header: 'Action',
      cell: (data: any) => {
        const { bucket_info, listed, groupId } = data;
        return (
          <div>
            <Button
              size={'sm'}
              onClick={async () => {
                if (!listed) {
                  reportEvent({ name: 'dm.profile.list.list.click' });
                  await switchNetwork?.(GF_CHAIN_ID);
                  modalData.modalDispatch({
                    type: 'OPEN_LIST',
                    initInfo: bucket_info,
                  });
                } else {
                  const { bucket_name, create_at, owner } = bucket_info;
                  modalData.modalDispatch({
                    type: 'OPEN_DELIST',
                    delistData: {
                      groupId,
                      bucket_name,
                      create_at,
                      owner,
                    },
                  });
                }
              }}
            >
              {!listed ? 'List' : 'Delist'}
            </Button>
          </div>
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
        // containerStyle={{ padding: '4px 20px' }}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          onChange: handlePageChange,
          sx: PaginationSx,
        }}
        columns={columns}
        data={list}
        loading={loading}
        customComponent={showNoData && <CollNoData></CollNoData>}
        {...TableProps}
      />
    </Container>
  );
};

export default MyCollectionList;

const Container = styled.div`
  background: #181a1e;
  padding: 4px 20px;
  width: 1123px;
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
