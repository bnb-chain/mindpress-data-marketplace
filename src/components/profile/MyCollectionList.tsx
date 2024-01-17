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
import { getItemByBucketId } from '../../utils/apis';
import _ from 'lodash';

const PriceCon = (props: { groupId: string }) => {
  const { groupId } = props;
  const { price } = useListedStatus(groupId);

  let balance = '-';
  if (price) {
    balance = divide10Exp(new BN(price, 10), 18) + ' BNB';
  }
  return <div>{balance}</div>;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ICollectionList {
  // setShowButton: Dispatch<boolean>;
}
const MyCollectionList = (props: ICollectionList) => {
  const pageSize = 10;

  const { handlePageChange, page } = usePagination();
  // const { setShowButton } = props;
  const modalData = useModal();
  // const { list, loading, total } = useCollectionList(page, pageSize, modalData.modalState.result);
  const { list, loading, total } = useCollectionList(
    page,
    pageSize,
    modalData.modalState.result,
  );
  const { switchNetwork } = useSwitchNetwork();
  const navigator = useNavigate();

  return <Container></Container>;
};

export default MyCollectionList;

const Container = styled.div``;
