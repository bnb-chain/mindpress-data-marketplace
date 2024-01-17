import styled from '@emotion/styled';
import { Box, Flex, Image, Stack, VStack } from '@totejs/uikit';
import { MetaMaskAvatar } from 'react-metamask-avatar';
import Masonry from 'react-responsive-masonry';
import { useNavigate } from 'react-router-dom';
import { trimLongStr } from '../../../utils';
import { Item } from '../../../utils/apis/types';
import { DefaultButton } from '../buttons/DefaultButton';
import { useGetRelationWithAddr } from '../../../hooks/useGetItemRelationWithAddr';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import { Loader } from '../../Loader';
import { YellowButton } from '../buttons/YellowButton';
import { useWalletModal } from '../../../hooks/useWalletModal';
import { useModal } from '../../../hooks/useModal';

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
  const { address, isConnected, isConnecting } = useAccount();

  const [activeItem, setActiveItem] = useState<Item | null>(null);

  const {
    relation,
    isLoading: relationisLoading,
    downloadUrl,
  } = useGetRelationWithAddr(address, activeItem);

  const modalData = useModal();
  const { handleModalOpen } = useWalletModal();

  if (!list) return null;

  return (
    <MasmonryContainer>
      <Masonry columnsCount={3} gutter="24px">
        {list.map((item) => {
          return (
            <Card
              key={item.id}
              onClick={() => {
                navigator(`/resource?id=${item.id}&path=/`);
              }}
              onMouseEnter={() => {
                setActiveItem(item);
              }}
            >
              <CardHover className="hover-layer">
                <UserInfo
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator(`/profile?address=${item.ownerAddress}`);
                  }}
                >
                  <MetaMaskAvatar size={24} address={item.ownerAddress} />
                  <Box>{trimLongStr(item.ownerAddress)}</Box>
                </UserInfo>
                {relationisLoading ? (
                  <Loader />
                ) : (
                  <Stack alignItems="center">
                    {relation === 'PURCHASED' && (
                      <DefaultButton
                        h="48px"
                        bg="#F1F2F3"
                        color="#181A1E"
                        fontWeight="800"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(downloadUrl);
                        }}
                      >
                        Download
                      </DefaultButton>
                    )}
                    {(relation === 'NOT_PURCHASE' ||
                      relation === 'UNKNOWN') && (
                      <YellowButton
                        h="48px"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (relation === 'UNKNOWN') {
                            if (!isConnected && !isConnecting) {
                              handleModalOpen();
                            }
                          } else {
                            modalData.modalDispatch({
                              type: 'OPEN_BUY',
                              buyData: activeItem,
                            });
                          }
                        }}
                      >
                        Buy
                      </YellowButton>
                    )}
                    {/* TODO: DELIST Status */}
                  </Stack>
                )}
              </CardHover>
              <Image
                src={item.url}
                fallbackSrc={`https://picsum.photos/seed/${item.groupName}/400/600`}
              />
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

const CardHover = styled(Stack)`
  padding: 16px;
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
  justify-content: space-between;
`;

const UserInfo = styled(Flex)`
  align-items: center;
  gap: 8px;
  font-weight: 800;
  color: #f7f7f8;
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
