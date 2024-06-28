import styled from '@emotion/styled';
import {
  Box,
  Center,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Text,
} from '@totejs/uikit';
import { useImmerAtom } from 'jotai-immer';
import { delistAtom } from '../../atoms/delistAtom';
import { useDelist } from '../../hooks/seller/useDelist';
import { Loader } from '../Loader';
import { DelistIcon } from '../svgIcon/DelistIcon';
import { BlackSolidButton } from '../ui/buttons/BlackButton';

export const DelistModal = () => {
  const [delistInfo, setDelistInfo] = useImmerAtom(delistAtom);
  const { doDelist } = useDelist();

  return (
    <Container
      isOpen={delistInfo.openDelist}
      onClose={() => {
        setDelistInfo((draft) => {
          draft.openDelist = false;
        });
      }}
    >
      <ModalCloseButton />
      <CustomBody>
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
      </CustomBody>
      <ModalFooter>
        <BlackSolidButton
          isLoading={delistInfo.starting}
          fontWeight={900}
          onClick={async () => {
            await doDelist(delistInfo.params.groupId);
          }}
          _disabled={{
            bg: '#AEB4BC',
            cursor: 'not-allowed',
            _hover: {
              bg: '#AEB4BC',
            },
          }}
          loadingText={
            <Flex gap="5px" alignItems="center">
              <Loader
                minHeight={43}
                size={20}
                borderWidth={2}
                color="#E6E8EA"
                bg="#76808F"
              />
              <Box>Progressing</Box>
            </Flex>
          }
        >
          Confirm
        </BlackSolidButton>
      </ModalFooter>
    </Container>
  );
};

const Container = styled(Modal)`
  .ui-modal-content {
    background: #ffffff;
  }
`;

const CustomBody = styled(ModalBody)`
  /* height: 200px; */
  font-size: 20px;
  color: #000000;
  text-align: center;
`;
