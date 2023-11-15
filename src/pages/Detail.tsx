import styled from '@emotion/styled';
import { SendIcon } from '@totejs/icons';
import { Box, Button, Flex } from '@totejs/uikit';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Loader } from '../components/Loader';
import { NoData } from '../components/NoData';
import { useGetBucketById } from '../hooks/useGetBucketOrObj';
import {
  defaultImg,
  formatDateUTC,
  generateGroupName,
  trimLongStr,
} from '../utils';
import { useGetItemByBucketId } from '../hooks/useGetItemByBucketId';
import _ from 'lodash';
import { DCELLAR_URL, GF_EXPLORER_URL } from '../env';
import { id, tr } from 'date-fns/locale';
import { useModal } from '../hooks/useModal';
import { useCollectionItems } from '../hooks/useCollectionItems';
import List from '../components/detail/List';
import { useStatus } from '../hooks/useStatus';
import { useGfGetObjInfo } from '../hooks/useGfGetObjInfo';
import { Bucket } from '../components/detail/Bucket';
import { Object } from '../components/detail/Object';

/**
 * Have not been listed
 * Show bucket or object detail info
 */
export const Detail = () => {
  const [p] = useSearchParams();

  const bucketId = p.get('bid') as string;
  const objectId = p.get('oid') as string;

  return (
    <Container>
      {bucketId && !objectId && <Bucket />}
      {objectId && objectId && <Object />}
    </Container>
  );
};

const Container = styled.div`
  padding-top: 60px;
  width: 1000px;
`;
