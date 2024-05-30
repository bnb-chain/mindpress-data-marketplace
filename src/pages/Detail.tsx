import styled from '@emotion/styled';
import { useSearchParams } from 'react-router-dom';
import { Object } from '../components/detail/Object';

/**
 * Have not been listed
 *
 * Show bucket or object detail info to be listed
 */
export const Detail = () => {
  const [p] = useSearchParams();

  // const bucketId = p.get('bid') as string;
  const objectId = p.get('oid') as string;

  return (
    <Container>
      {/* {bucketId && !objectId && <Bucket />} */}
      {objectId && objectId && <Object />}
    </Container>
  );
};

const Container = styled.div`
  padding-top: 60px;
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;
