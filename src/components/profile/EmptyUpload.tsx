import { useSetAtom } from 'jotai';
import { uploadObjcetAtom } from '../../atoms/uploadObjectAtom';
import EmptyImage from '../../images/emptyList.svg';
import { Box, Button, Center, Image } from '@totejs/uikit';
import { tr } from 'date-fns/locale';

export const EmptyUpload: React.FC = () => {
  const setUpobjs = useSetAtom(uploadObjcetAtom);

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
        Upload to earn rewards
      </Box>
      <Box fontSize="16px" color="#8C8F9B">
        You haven't upload any photos yet.
      </Box>
      <Button
        variant="ghost"
        borderColor="#F1F2F3"
        onClick={() => {
          setUpobjs((draft) => {
            draft.openModal = true;
          });
        }}
      >
        Upload Images
      </Button>
    </Center>
  );
};
