import styled from '@emotion/styled';
import {
  Box,
  Button,
  Flex,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Stack,
  StateModal,
  StateModalVariantType,
} from '@totejs/uikit';
import { useNavigate } from 'react-router-dom';
import { useGetRandomSp } from '../../hooks/useGetRandomSp';
import { parseGroupName } from '../../utils';
import { getItemByGroupId } from '../../utils/apis';
import { SuccessIcon } from '../svgIcon/SuccessIcon';
import { BigYellowButton } from '../ui/buttons/YellowButton';

const CustomSuccessIcon = () => (
  <Flex
    w="56px"
    h="56px"
    bg="#53EAA1"
    borderRadius="56px"
    border="12px solid #BFF8DC"
    overflow="hidden"
    justifyContent="center"
    alignItems="center"
    boxSizing="content-box"
  >
    <SuccessIcon w="40px" h="40px" />
  </Flex>
);

interface IActionResult {
  isOpen: boolean;
  type?: string;
  handleOpen: (b?: boolean) => void;
  variant?: StateModalVariantType;
  description: string;
  callBack?: () => void;
  groupId?: string;
}
export const ActionResult = (props: IActionResult) => {
  const { type, isOpen, groupId, handleOpen, variant, description, callBack } =
    props;

  const { data: endpoint, isLoading } = useGetRandomSp();

  const navigator = useNavigate();

  if (type === 'BUY') {
    return (
      <Container
        isOpen={isOpen}
        onClose={handleOpen}
        icon={<CustomSuccessIcon />}
      >
        <ModalCloseButton />
        <Stack>
          <ModalHeader color="#181A1E" fontSize="24px" fontWeight="800">
            Purchased successfully!
          </ModalHeader>
          <ModalBody>
            <Box
              w="355px"
              color="#5C5F6A"
              fontSize="16px"
              textAlign="center"
              mb="24px"
            >
              You can now download the high-quality image now.
            </Box>

            <Stack w="100%" gap="16px">
              <Button
                bg="#14151A"
                p="12px 16px"
                color="#FFF"
                fontSize="16px"
                _hover={{
                  bg: '#14151A',
                  color: '#FFF',
                }}
                onClick={async () => {
                  // handleOpen();
                  if (!groupId) return;
                  const res = await getItemByGroupId(groupId);
                  const { bucketName, name } = parseGroupName(res.groupName);

                  const downloadUrl = `${endpoint}/download/${bucketName}/${name}`;
                  window.open(downloadUrl);
                }}
              >
                Download
              </Button>
              <Button
                variant="ghost"
                p="12px 16px"
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
                  if (!groupId) return;
                  const res = await getItemByGroupId(groupId);
                  handleOpen();
                  navigator(`/resource?id=${res.id}&gid=${res.groupId}`);
                }}
              >
                View Detail
              </Button>
            </Stack>
          </ModalBody>
        </Stack>
      </Container>
    );
  }

  return (
    <Container
      variant={variant}
      isOpen={isOpen}
      onClose={handleOpen}
      // icon={<CustomSuccessIcon />}
      description={description || 'buy error'}
    >
      <BigYellowButton
        width={'100%'}
        onClick={() => {
          callBack?.();
          handleOpen();
        }}
      >
        Got it
      </BigYellowButton>
    </Container>
  );
};

const Container = styled(StateModal)`
  .ui-modal-content {
    background: #ffffff;
  }
  color: #000000;
`;
