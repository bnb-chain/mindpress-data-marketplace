import NiceModal from '@ebay/nice-modal-react';
import { Tips } from '../../components/modal/Tips';
import { Box, Center, Flex, Text } from '@totejs/uikit';
import { DelistIcon } from '../../components/svgIcon/DelistIcon';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { MarketplaceAbi } from '../../base/contract/marketplace.abi';
import { BSC_CHAIN, NEW_MARKETPLACE_CONTRACT_ADDRESS } from '../../env';

export const useDelist = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient({
    chainId: BSC_CHAIN.id,
  });
  const { data: walletClient } = useWalletClient();

  const doDeist = async (groupId: bigint) => {
    const { request } = await publicClient.simulateContract({
      account: address,
      abi: MarketplaceAbi,
      address: NEW_MARKETPLACE_CONTRACT_ADDRESS,
      functionName: 'delist',
      args: [groupId],
    });

    const hash = await walletClient?.writeContract(request);
    console.log('hash', hash);

    if (hash) {
      await publicClient.waitForTransactionReceipt({
        hash,
      });
    }
  };

  const confirmDelist = (groupId: bigint) => {
    NiceModal.show(Tips, {
      title: ``,
      content: (
        <Box>
          <Flex justifyContent="center" alignItems="center">
            <Center w="80px" h="80px" bg="#F1F2F3" borderRadius="50%">
              <DelistIcon boxSize={56} w="56px" h="56px" />
            </Center>
          </Flex>

          <Text as="h2" fontSize="24px" mt="24px">
            Delist
          </Text>
          <Text fontSize="14px" color="#76808F">
            Are you sure to delist this image from Marketplace? Users will be
            unable to purchase it after it is delisted.
          </Text>
        </Box>
      ),
      buttonText: 'Confirm',
      buttonClick: async () => {
        // ... dolist
        // await doDeist(groupId);
      },
    });
  };

  return {
    doDeist,
    confirmDelist,
  };
};
