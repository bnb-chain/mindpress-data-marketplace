import styled from '@emotion/styled';
import { useModal as useWalletKitModal } from '@node-real/walletkit';
import { Box, Flex, Stack } from '@totejs/uikit';
import { MetaMaskAvatar } from 'react-metamask-avatar';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useGetRelationWithAddr } from '../hooks/useGetItemRelationWithAddr';
import { useModal } from '../hooks/useModal';
import { trimLongStr } from '../utils';
import { Item } from '../utils/apis/types';
import { DefaultButton } from './ui/buttons/DefaultButton';
import { YellowButton } from './ui/buttons/YellowButton';

interface IProps {
  item: Item;
  className: string;
}

export const HoverStatus = ({ item, className }: IProps) => {
  const navigator = useNavigate();
  const { address, isConnected, isConnecting } = useAccount();
  const {
    relation,
    isLoading: relationisLoading,
    downloadUrl,
  } = useGetRelationWithAddr(address, item);
  const modalData = useModal();
  const { onOpen } = useWalletKitModal();

  return (
    <CardHover className={className}>
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
        // <Loader />
        <Box></Box>
      ) : (
        <Stack alignItems="center">
          {(relation === 'PURCHASED' || relation === 'OWNER') && (
            <DefaultButton
              minW="120px"
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
          {(relation === 'NOT_PURCHASE' || relation === 'UNKNOWN') && (
            <YellowButton
              minW="120px"
              h="48px"
              onClick={(e) => {
                e.stopPropagation();
                if (relation === 'UNKNOWN') {
                  if (!isConnected && !isConnecting) {
                    onOpen();
                  }
                } else {
                  modalData.modalDispatch({
                    type: 'OPEN_BUY',
                    buyData: item,
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
  );
};

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
