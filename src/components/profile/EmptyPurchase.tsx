import EmptyImage from '../../images/emptyList.svg';
import { Box, Center, Image } from '@totejs/uikit';

export const EmptyPurchase: React.FC = () => {
  return (
    <Center
      flexDirection="column"
      w="800px"
      mx="auto"
      my="40px"
      py="40px"
      gap="16px"
    >
      <Image w="200px" src={EmptyImage} />
      <Box color="#F7F7F8" fontSize="24px" fontWeight="800">
        No Purchased Image
      </Box>
      <Box fontSize="16px" color="#8C8F9B">
        You haven't buy any photos yet.
      </Box>
    </Center>
  );
};
