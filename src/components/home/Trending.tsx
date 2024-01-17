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
    <CardContainer>
      <Title as="h2">Trending Images</Title>

      <MindPressMasmonry
        hasMore={hasNextPage}
        list={trendingList}
        handleLoadMore={handleNextPage}
      />
      {/* <MasmonryContainer>
        <Masonry columnsCount={3} gutter="24px">
          {trendingList &&
            trendingList.map((item) => {
              return (
                <Card
                  key={item.id}
                  onClick={() => {
                    navigator(`/resource?id=${item.id}&path=/`);
                  }}
                >
                  <CardHover className="hover-layer">
                    <UserInfo>
                      <MetaMaskAvatar size={24} address={item.ownerAddress} />
                      <Box>{trimLongStr(item.ownerAddress)}</Box>
                    </UserInfo>
                  </CardHover>
                  <img
                    src={
                      item.url ||
                      `https://picsum.photos/seed/${item.groupName}/400/600`
                    }
                  />
                </Card>
              );
            })}
        </Masonry>

        <LoadMoreContainer>
          <LoadMore
            disabled={!hasNextPage}
            onClick={() => {
              handleNextPage();
            }}
          >
            Discover More
          </LoadMore>
        </LoadMoreContainer>
      </MasmonryContainer> */}
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
