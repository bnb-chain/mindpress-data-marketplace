import styled from '@emotion/styled';
import { Box, Flex } from '@totejs/uikit';
import { useSearchParams } from 'react-router-dom';
import { useInfiniteGetItemList } from '../hooks/useGetItemList';
import { MindPressMasmonry } from '../components/ui/masmonry';
import { useCallback } from 'react';

const Search = () => {
  const [p] = useSearchParams();
  const kw = p.get('kw') as string;

  const {
    fetchNextPage,
    hasNextPage,
    total,
    flatData: searchList,
  } = useInfiniteGetItemList({
    filter: {
      address: '',
      keyword: kw,
    },
    offset: 0,
    limit: 10,
    sort: 'CREATION_DESC',
  });

  const handleNextPage = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  // console.log('searchList', searchList, xx);

  if (!kw) return null;

  return (
    <Container>
      <Keyword>{kw}</Keyword>
      <Desc>{total} building stock photos are available royalty-free</Desc>

      <Box mt="40px">
        <MindPressMasmonry
          list={searchList}
          hasMore={hasNextPage}
          handleLoadMore={handleNextPage}
        />
      </Box>
    </Container>
  );
};

export default Search;

const Container = styled(Box)`
  width: 1400px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 40px;
`;

const Keyword = styled(Flex)`
  color: #f7f7f8;
  font-size: 32px;
  background-color: #14151a;
`;

const Desc = styled(Box)`
  margin-top: 16px;
  color: #8c8f9b;
  font-size: 16px;
  line-height: 24px;
`;
