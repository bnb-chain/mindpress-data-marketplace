import styled from '@emotion/styled';
import { Box } from '@totejs/uikit';
import { useCallback } from 'react';
import { useInfiniteGetItemList } from '../../hooks/useGetItemList';
import { Loader } from '../Loader';
import { MindPressMasmonry } from '../ui/masmonry';

export const Trending = () => {
  const {
    fetchNextPage,
    hasNextPage,
    flatData: trendingList,
  } = useInfiniteGetItemList({
    filter: {
      address: '',
      keyword: '',
    },
    offset: 0,
    limit: 20,
    sort: 'CREATION_DESC',
  });

  const handleNextPage = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  // console.log('trendingList', trendingList, hasNextPage);

  if (!trendingList) return <Loader />;

  return (
    <Container>
      <Title as="h2">Trending Images</Title>

      <MindPressMasmonry
        hasMore={hasNextPage}
        list={trendingList}
        handleLoadMore={handleNextPage}
      />
    </Container>
  );
};

const Container = styled(Box)``;

const Title = styled(Box)`
  margin-bottom: 40px;
  color: #f7f7f8;
  text-align: center;
  font-size: 32px;
  font-weight: 700;
`;
