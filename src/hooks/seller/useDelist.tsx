import NiceModal from '@ebay/nice-modal-react';
import { Tips } from '../../components/modal/Tips';
import { Box, Center, Flex, Text } from '@totejs/uikit';
import { DelistIcon } from '../../components/svgIcon/DelistIcon';

export const useDelist = () => {
  const doDeist = async () => {
    // alert(1);
  };

  const confirmDelist = () => {
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
            Are you sure to delist this photo from Marketplace? Users will be
            unable to purchase it after it is delisted.
          </Text>
        </Box>
      ),
      buttonText: 'Confirm',
      buttonClick: async () => {
        // ... dolist
        await doDeist();
      },
    });
  };

  return {
    doDeist,
    confirmDelist,
  };
};
