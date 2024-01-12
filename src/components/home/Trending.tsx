import styled from '@emotion/styled';
import { Box, Stack, VStack } from '@totejs/uikit';
import Masonry from 'react-responsive-masonry';
import { useInfiniteGetItemList } from '../../hooks/useGetItemList';
import { DefaultButton } from '../ui/buttons/DefaultButton';
import { Loader } from '../Loader';

export const Trending = () => {
  const {
    fetchNextPage,
    hasNextPage,
    flatData: trendingList,
  } = useInfiniteGetItemList();

  const handleNextPage = () => {
    fetchNextPage();
  };

  // console.log('trendingList', trendingList, hasNextPage);

  if (!trendingList) return <Loader />;

  return (
    <CardContainer>
      <Title as="h2">Trending Images</Title>

      <Masonry columnsCount={3} gutter="24px">
        {trendingList &&
          trendingList.map((item) => {
            return (
              <Card key={item.id}>
                <img
                  src={item.url || 'https://picsum.photos/seed/picsum/400/600'}
                />
              </Card>
            );
          })}
      </Masonry>

      <VStack>
        <LoadMore
          disabled={!hasNextPage}
          onClick={() => {
            handleNextPage();
          }}
        >
          Discover More
        </LoadMore>
      </VStack>
    </CardContainer>
  );
};

const CardContainer = styled(Box)`
  padding-left: 120px;
  padding-right: 120px;
`;

const Title = styled(Box)`
  margin-bottom: 40px;
  color: #f7f7f8;
  text-align: center;
  font-size: 32px;
  font-weight: 700;
`;

const Card = styled(Box)`
  width: 384px;

  & > img {
    width: 384px;
    object-fit: cover;
  }
`;

const LoadMore = styled(DefaultButton)`
  background: #f1f2f3;
  color: #181a1e;
  font-size: 16px;
  font-weight: 600;
  height: 64px;
  padding: 20px 24px;
`;
