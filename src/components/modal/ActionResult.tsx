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
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { offchainDataAtom } from '../../atoms/offchainDataAtomAtom';
import { useGetChainListItems } from '../../hooks/buyer/useGetChainListItems';
import { getItemByGroupId } from '../../utils/apis';
import { client } from '../../utils/gfSDK';
import { sleep } from '../../utils/space';
import { Loader } from '../Loader';
import { SuccessIcon } from '../svgIcon/SuccessIcon';
import { BigYellowButton } from '../ui/buttons/YellowButton';

export const CustomSuccessIcon = () => (
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

  const { address } = useAccount();
  const offchainData = useAtomValue(offchainDataAtom);
  const [downloading, setDownloadLoading] = useState(false);

  const navigator = useNavigate();

  const { data: items, isPending } = useGetChainListItems([
    BigInt(groupId || 0),
  ]);

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
                _disabled={{
                  bg: '#14151A',
                  color: '#FFF',
                  cursor: 'not-allowed',
                }}
                _hover={{
                  bg: '#14151A',
                  color: '#FFF',
                }}
                _active={{
                  bg: '#14151A',
                  color: '#FFF',
                }}
                isLoading={downloading}
                loadingText={
                  <Flex gap="5px" alignItems="center">
                    <Loader
                      minHeight={43}
                      size={20}
                      borderWidth={2}
                      color="#E1E2E5"
                      bg="#181A1E"
                    />
                    <Box>Download</Box>
                  </Flex>
                }
                onClick={async () => {
                  // handleOpen();
                  if (!groupId) return;
                  if (!address) return;

                  setDownloadLoading(true);

                  const objectId = items?.objectIds?.[0];
                  console.log('objectId', objectId);

                  let headObjectResponse;
                  while (true) {
                    headObjectResponse = await client.object.headObjectById(
                      String(objectId),
                    );
                    if (headObjectResponse) {
                      break;
                    }
                    await sleep(5000);
                  }

                  await client.object.downloadFile(
                    {
                      bucketName:
                        headObjectResponse.objectInfo?.bucketName || '',
                      objectName:
                        headObjectResponse.objectInfo?.objectName || '',
                    },
                    {
                      type: 'EDDSA',
                      address,
                      domain: window.location.origin,
                      seed: offchainData?.seed || '',
                    },
                  );
                  setDownloadLoading(false);
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
                  navigator(`/resource?gid=${res.groupId}`);
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
