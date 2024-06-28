import NiceModal, { useModal } from '@ebay/nice-modal-react';
import styled from '@emotion/styled';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from '@totejs/uikit';
import { BlackSolidButton } from '../ui/buttons/BlackButton';

export const Tips = NiceModal.create<{
  title: string;
  content: React.ReactNode;
  buttonText: React.ReactNode;
  buttonClick?: () => Promise<void>;
  isLoading?: boolean;
}>(({ title, content, buttonText, buttonClick, isLoading = false }) => {
  const modal = useModal();

  return (
    <Container isOpen={modal.visible} onClose={modal.hide}>
      <ModalCloseButton />
      <Header>{title}</Header>
      <CustomBody>{content}</CustomBody>
      <ModalFooter>
        <BlackSolidButton
          isLoading={isLoading}
          fontWeight={900}
          onClick={async () => {
            await buttonClick?.();
            modal.resolve();
            modal.hide();
          }}
        >
          {buttonText}
        </BlackSolidButton>
      </ModalFooter>
    </Container>
  );
});

const Container = styled(Modal)`
  .ui-modal-content {
    background: #ffffff;
  }
`;

const Header = styled(ModalHeader)`
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;

  display: flex;
  align-items: center;
  text-align: center;

  color: #000000;
`;

const CustomBody = styled(ModalBody)`
  /* height: 200px; */
  font-size: 20px;
  color: #000000;
  text-align: center;
`;
