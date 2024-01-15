import styled from '@emotion/styled';
import { Box, Flex, VStack } from '@totejs/uikit';
import { MetaMaskAvatar } from 'react-metamask-avatar';
import Masonry from 'react-responsive-masonry';
import { useInfiniteGetItemList } from '../../hooks/useGetItemList';
import { trimLongStr } from '../../utils';
import { Loader } from '../Loader';
import { DefaultButton } from '../ui/buttons/DefaultButton';
import { useNavigate } from 'react-router-dom';

export const Trending = () => {
  const navigator = useNavigate();
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

      <MasmonryContainer>
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
      </MasmonryContainer>
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
  position: relative;
  width: 384px;
  cursor: pointer;

  & > img {
    width: 384px;
    object-fit: cover;
  }

  &:hover {
    .hover-layer {
      display: block;
    }
  }
`;

const CardHover = styled(Box)`
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    50% 50% at 50% 50%,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.2) 100%
  );
`;

const UserInfo = styled(Flex)`
  padding: 16px;
  align-items: center;
  gap: 8px;
`;

const MasmonryContainer = styled(Box)`
  position: relative;
`;

const LoadMoreContainer = styled(VStack)`
  background: linear-gradient(
    180deg,
    rgba(20, 21, 26, 0) 0%,
    rgba(20, 21, 26, 0.63) 39.06%,
    #14151a 100%
  );

  /* background: red; */
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 100px 0 40px 0;
`;

const LoadMore = styled(DefaultButton)`
  background: #f1f2f3;
  color: #181a1e;
  font-size: 16px;
  font-weight: 600;
  height: 64px;
  padding: 20px 24px;
`;
