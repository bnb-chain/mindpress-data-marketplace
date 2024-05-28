import styled from '@emotion/styled';
import { Box, Flex } from '@totejs/uikit';
import { useSearchParams } from 'react-router-dom';
import { Category } from '../components/search/category';
import { Kw } from '../components/search/kw';
import { useGetCategory } from '../hooks/apis/useGetCatoriesMap';

const Search = () => {
  const [p] = useSearchParams();
  // search keyword
  const kw = (p.get('kw') as string) || '';
  // search category id
  const c = (p.get('c') as string) || '-1';
  const category = useGetCategory(Number(c));

  return (
    <Container>
      <Keyword>{kw || category?.name}</Keyword>

      {kw && <Kw kw={kw} />}
      {c !== '-1' && <Category cid={c} />}

      {/* {total < 20 && (
        <Box mt="40px">
          <RelatedImage
            title="Images you might be interested in"
            categoryId={category?.id || 100}
          />
        </Box>
      )} */}
    </Container>
  );
};

export default Search;

const Container = styled(Box)`
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 40px;
`;

const Keyword = styled(Flex)`
  color: #f7f7f8;
  font-size: 32px;
  font-weight: 700;
  background-color: #14151a;
`;

const Desc = styled(Box)`
  margin-top: 16px;
  color: #8c8f9b;
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
`;
