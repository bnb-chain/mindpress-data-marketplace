import { Box, Flex } from '@totejs/uikit';
import { LockIcon } from '../svgIcon/LockIcon';
import { useAccount } from 'wagmi';
import { useGlobal } from '../../hooks/useGlobal';
import { useModal } from '../../hooks/useModal';
import { useWalletModal } from '../../hooks/useWalletModal';

interface Props {
  baseInfo?: any;
}

export const BuyData = (props: Props) => {
  const { baseInfo } = props;
  const { address, isConnected, isConnecting } = useAccount();
  const { handleModalOpen } = useWalletModal();
  const state = useGlobal();
  const modalData = useModal();

  return (
    <Box bg="#1E2026" w="590px" borderRadius="16px">
      <Flex mt="32px" p="75px 125px" direction="column" alignItems="center">
        <Flex
          w="88px"
          h="88px"
          bg="#181A1E"
          justifyContent="center"
          alignItems="center"
          borderRadius="88px"
          border="20px solid #373943"
        >
          <LockIcon w={32} h={32} />
        </Flex>

        <Box
          as="p"
          mt="30px"
          color="#C4C5CB"
          fontSize="16px"
          textAlign="center"
        >
          After you{' '}
          <Box
            as="button"
            color="#FFE900"
            onClick={() => {
              if (!isConnected && !isConnecting) {
                handleModalOpen();
              } else {
                modalData.modalDispatch({
                  type: 'OPEN_BUY',
                  buyData: baseInfo,
                });
              }
            }}
          >
            purchase
          </Box>{' '}
          the data, you can view <br /> and download.
        </Box>
      </Flex>
    </Box>
  );
};
