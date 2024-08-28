import styled from '@emotion/styled';
import { Box } from '@totejs/uikit';
import { useCallback } from 'react';
import {
  TRENDING_PAGE_SIZE,
  useInfiniteGetItemList,
} from '../../hooks/useGetItemList';
import { Loader } from '../Loader';
import { MindPressMasmonry } from '../ui/masmonry';

export const Trending = () => {
  const {
    fetchNextPage,
    hasNextPage,
    flatData: trendingList,
    isLoading,
  } = useInfiniteGetItemList({
    filter: {
      address: '',
      keyword: '',
    },
    offset: 0,
    limit: TRENDING_PAGE_SIZE,
    sort: 'CREATION_DESC',
  });

  const handleNextPage = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  // console.log('trendingList', hasNextPage, trendingList);

  if (!trendingList || isLoading) return <Loader />;

  // console.log('trendingList', trendingList);

  return (
    <Box w="100%" px={['30px', null, '0px']} maxW="1200px">
      <Title as="h2">Trending Images</Title>

      <MindPressMasmonry
        hasMore={hasNextPage}
        list={trendingList}
        handleLoadMore={handleNextPage}
      />
    </Box>
  );
};

const Title = styled(Box)`
  margin-bottom: 40px;
  color: #f7f7f8;
  text-align: center;
  font-size: 32px;
  font-weight: 500;
`;
