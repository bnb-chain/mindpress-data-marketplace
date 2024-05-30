import styled from '@emotion/styled';
import { Box, Image, VStack } from '@totejs/uikit';
import { useState } from 'react';
import Masonry from 'react-responsive-masonry';
import { useNavigate } from 'react-router-dom';
import { Item } from '../../../utils/apis/types';
import { HoverStatus } from '../../HoverStatus';
import { DefaultButton } from '../buttons/DefaultButton';
import DefaultImage from '../default-image';

interface IProps {
  list?: Item[];
  hasMore: boolean;
  handleLoadMore?: () => void;
}

export const MindPressMasmonry = ({
  list,
  hasMore,
  handleLoadMore: loadMore,
}: IProps) => {
  const navigator = useNavigate();
  const [activeItem, setActiveItem] = useState<Item | null>(null);

  if (!list) return null;

  return (
    <MasmonryContainer>
      <Masonry columnsCount={3} gutter="24px">
        {list.map((item) => {
          return (
            <Card
              key={item.id}
              onClick={() => {
                navigator(`/resource?gid=${item.groupId}`);
              }}
              onMouseEnter={() => {
                setActiveItem(item);
              }}
            >
              {activeItem && (
                <HoverStatus className="hover-layer" item={activeItem} />
              )}
              <Image src={item.url} fallbackSrc={DefaultImage} alt={item.url} />
            </Card>
          );
        })}
      </Masonry>

      {hasMore && (
        <LoadMoreContainer>
          <LoadMore
            disabled={!loadMore}
            onClick={() => {
              loadMore?.();
            }}
          >
            Discover More
          </LoadMore>
        </LoadMoreContainer>
      )}
    </MasmonryContainer>
  );
};

const Card = styled(Box)`
  position: relative;
  /* width: 384px; */
  cursor: pointer;

  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    .hover-layer {
      display: flex;
    }
  }
`;

const MasmonryContainer = styled(Box)`
  position: relative;
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
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
