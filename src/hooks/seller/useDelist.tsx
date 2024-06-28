import NiceModal from '@ebay/nice-modal-react';
import {
  Box,
  Button,
  Center,
  Flex,
  ModalBody,
  ModalHeader,
  Stack,
  Text,
  VStack,
} from '@totejs/uikit';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { MarketplaceAbi } from '../../base/contract/marketplace.abi';
import { Loader } from '../../components/Loader';
import { CustomSuccessIcon } from '../../components/modal/ActionResult';
import { Tips } from '../../components/modal/Tips';
import { DelistIcon } from '../../components/svgIcon/DelistIcon';
import { BSC_CHAIN, NEW_MARKETPLACE_CONTRACT_ADDRESS } from '../../env';

interface Params {
  onSuccess?: () => Promise<void>;
}

export const useDelist = ({ onSuccess }: Params = {}) => {
  const [start, setStart] = useState(false);
  const { address } = useAccount();
  const navigator = useNavigate();
  const publicClient = usePublicClient({
    chainId: BSC_CHAIN.id,
  });
  const { data: walletClient } = useWalletClient();

  const doDelist = async (groupId: bigint) => {
    setStart(true);

    try {
      // await delisting(groupId, true);
      const { request } = await publicClient.simulateContract({
        account: address,
        abi: MarketplaceAbi,
        address: NEW_MARKETPLACE_CONTRACT_ADDRESS,
        functionName: 'delist',
        args: [groupId],
      });

      const hash = await walletClient?.writeContract(request);

      if (hash) {
        await publicClient.waitForTransactionReceipt({
          hash,
        });
      }

      await succDelist();
      await onSuccess?.();
    } catch (err) {
    } finally {
      setStart(false);
    }
  };

  const confirmDelist = (groupId: bigint) => {
    NiceModal.show(Tips, {
      title: ``,
      isLoading: start,
      content: (
        <Box>
          <Flex justifyContent="center" alignItems="center">
            <Center w="80px" h="80px" bg="#F1F2F3" borderRadius="50%">
              <DelistIcon boxSize={56} w="56px" h="56px" />
            </Center>
          </Flex>
          <Text as="h2" fontSize="24px" mt="24px" fontWeight={700}>
            Delist
          </Text>
          <Text fontSize="14px" color="#76808F" mt="8px">
            Are you sure to delist this image from Marketplace? Users will be
            unable to purchase it after it is delisted.
          </Text>
        </Box>
      ),
      buttonText: (
        <>
          {start ? (
            <Flex gap="5px" alignItems="center">
              <Loader
                minHeight={43}
                size={20}
                borderWidth={2}
                color="#E6E8EA"
                bg="#76808F"
              />
            </Flex>
          ) : (
            'Confirm'
          )}
        </>
      ),
      buttonClick: async () => {
        await doDelist(groupId);
      },
    });
  };

  const succDelist = async () => {
    NiceModal.show(Tips, {
      title: ``,
      content: (
        <Stack>
          <VStack>
            <CustomSuccessIcon />
            <ModalHeader color="#181A1E" fontSize="24px" fontWeight="800">
              Delist successfully!
            </ModalHeader>
          </VStack>
          <ModalBody>
            <Box color="#5C5F6A" fontSize="16px" textAlign="center" mb="24px">
              You can now download the high-quality image now.
            </Box>
            <VStack>
              <Button
                w="100%"
                variant="ghost"
                height="48px"
                color="#14151A"
                sx={{
                  bg: '#ffffff',
                  border: '1px solid #14151A',
                }}
                _hover={{
                  color: '#14151A',
                  bg: '#ffffff',
                }}
                onClick={async () => {
                  navigator(`/profile?tab=uploaded`);
                }}
              >
                Go to My Upload
              </Button>
            </VStack>
          </ModalBody>
        </Stack>
      ),
      buttonText: 'Got it',
      buttonClick: async () => {
        // ...
      },
    });
  };

  return {
    doDelist,
    confirmDelist,
  };
};
