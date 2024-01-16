import styled from '@emotion/styled';
import { Flex } from '@totejs/uikit';
import { useSearchParams } from 'react-router-dom';

const Search = () => {
  const [p] = useSearchParams();
  const kw = p.get('kw') as string;

  if (!kw) return null;

  return (
    <Container flexDirection={'column'} alignItems={'center'}>
      search page
    </Container>
  );
};

export default Search;

const Container = styled(Flex)`
  /* margin-top: -80px; */
  /* width: 100%; */
  /* background-color: #1e2026; */
`;
